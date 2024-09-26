CREATE TABLE locations (
    id bigint primary key generated always as identity,
    name text,
    x numeric,
    y numeric,
    type text
);

INSERT INTO locations (name, x, y) VALUES
('El Salto del Topo', 89.7, 75.8),
('El Salto del Muro', 79.6, 84.7),
('El Salto del Creeper', 89, 69.5),
('El Salto del Laburo', 81, 74.7),
('El Salto del Tejado', 86.7, 69.4),
('El Salto de la Muerte', 2.3, 70.3),
('El Salto de Aquaman', 45.8, 56),
('El Salto del Papu!!!', 18.3, 73.7),
('El Salto del Minipapu', 30, 62),
('El Salto Mini del Minipapu', 21.7, 53),
('El Salto de la Bresh', 6, 27.7),
('El Salto de la Roca', 23, 27.3),
('El Salto del Siglo', 23.5, 27.5),
('El Salto del Pony', 43.4, 18),
('El Salto del Vaquerito', 39.6, 7.6),
('El Salto del Marcianito', 53.4, 19),
('El Salto de la Mansion', 72.2, 62),
('El Salto del Rapero', 50.6, 69);
