-- ============================================
-- Migración: Arreglar search_path en funciones restantes
-- ============================================
-- Esta migración arregla las funciones que tienen search_path mutable
-- para mejorar la seguridad
-- ============================================

-- Arreglar get_user_by_id
CREATE OR REPLACE FUNCTION public.get_user_by_id(user_id uuid)
RETURNS profiles
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  user_data public.profiles;
BEGIN
  SELECT *
  INTO user_data
  FROM public.profiles
  WHERE id = user_id;

  RETURN user_data;
END;
$function$;

-- Arreglar update_player_count
CREATE OR REPLACE FUNCTION public.update_player_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE bingo_rooms
    SET players = players + 1
    WHERE id = NEW.room_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE bingo_rooms
    SET players = players - 1
    WHERE id = OLD.room_id;
  END IF;
  RETURN NULL;
END;
$function$;

-- Arreglar get_or_create_player_board
CREATE OR REPLACE FUNCTION public.get_or_create_player_board(p_user_id uuid, p_room_id bigint, p_board jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_board JSONB;
BEGIN
  -- Intentar obtener el tablero existente
  SELECT board INTO v_board
  FROM player_boards
  WHERE user_id = p_user_id AND room_id = p_room_id;
  
  -- Si no existe, crear uno nuevo
  IF v_board IS NULL THEN
    INSERT INTO player_boards (user_id, room_id, board)
    VALUES (p_user_id, p_room_id, p_board)
    RETURNING board INTO v_board;
  END IF;
  
  RETURN v_board;
END;
$function$;

-- Arreglar create_bingo_room (primera versión)
CREATE OR REPLACE FUNCTION public.create_bingo_room(room_name text, room_privacity room_privacity)
RETURNS bingo_rooms
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
    new_room bingo_rooms;
BEGIN
    INSERT INTO bingo_rooms (name, privacity, status, join_code)
    VALUES (room_name, room_privacity, 'active', generate_unique_join_code())
    RETURNING * INTO new_room;
    
    RETURN new_room;
END;
$function$;

-- Arreglar create_bingo_room (segunda versión con creator_id)
CREATE OR REPLACE FUNCTION public.create_bingo_room(room_name text, room_privacity room_privacity, creator_id uuid)
RETURNS bingo_rooms
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
    new_room bingo_rooms;
BEGIN
    INSERT INTO bingo_rooms (name, status, join_code, privacity, created_by)
    VALUES (room_name, 'active', generate_unique_join_code(), room_privacity, creator_id)
    RETURNING * INTO new_room;
    
    RETURN new_room;
END;
$function$;

-- Arreglar generate_unique_join_code
CREATE OR REPLACE FUNCTION public.generate_unique_join_code()
RETURNS character
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
    code CHAR(6);
    done BOOL;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        done := NOT EXISTS (SELECT 1 FROM bingo_rooms WHERE join_code = code);
    END LOOP;
    RETURN code;
END;
$function$;

-- Arreglar apply_message_event
CREATE OR REPLACE FUNCTION public.apply_message_event(p_channel text, p_session_id text, p_user_id text, p_username text, p_points integer, p_is_wall boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
begin
  -- global
  insert into public.user_stats (channel, user_id, username, messages_count, walltext_count, points)
  values (p_channel, p_user_id, p_username, 1, case when p_is_wall then 1 else 0 end, p_points)
  on conflict (channel, user_id)
  do update set
    username = excluded.username,
    messages_count = public.user_stats.messages_count + 1,
    walltext_count = public.user_stats.walltext_count + case when p_is_wall then 1 else 0 end,
    points = public.user_stats.points + p_points,
    updated_at = now();

  -- por sesión
  insert into public.user_stats_session (session_id, channel, user_id, username, messages_count, walltext_count, points)
  values (p_session_id, p_channel, p_user_id, p_username, 1, case when p_is_wall then 1 else 0 end, p_points)
  on conflict (session_id, user_id)
  do update set
    username = excluded.username,
    messages_count = public.user_stats_session.messages_count + 1,
    walltext_count = public.user_stats_session.walltext_count + case when p_is_wall then 1 else 0 end,
    points = public.user_stats_session.points + p_points;
end;
$function$;

-- Arreglar apply_presente
CREATE OR REPLACE FUNCTION public.apply_presente(p_channel text, p_session_id text, p_user_id text, p_username text, p_points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
begin
  -- global
  insert into public.user_stats (channel, user_id, username, messages_count, walltext_count, points)
  values (p_channel, p_user_id, p_username, 0, 0, p_points)
  on conflict (channel, user_id)
  do update set
    username = excluded.username,
    points = public.user_stats.points + p_points,
    updated_at = now();

  -- por sesión
  insert into public.user_stats_session (session_id, channel, user_id, username, messages_count, walltext_count, points)
  values (p_session_id, p_channel, p_user_id, p_username, 0, 0, p_points)
  on conflict (session_id, user_id)
  do update set
    username = excluded.username,
    points = public.user_stats_session.points + p_points;
end;
$function$;
