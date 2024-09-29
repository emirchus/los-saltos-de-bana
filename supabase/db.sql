CREATE TABLE IF NOT EXISTS locations (
    id bigint primary key generated always as identity,
    name text,
    x numeric,
    y numeric,
    type text
);

DELETE FROM locations;

INSERT INTO "public"."locations" ("id", "name", "x", "y", "type", "video") OVERRIDING SYSTEM VALUE VALUES
	(1, 'El Salto del Topo', 89.7, 75.8, 'salto', '0sdgiK2zN6w'),
	(2, 'El Salto del Muro', 79.6, 84.7, 'salto', 'yr_4WcULA3U'),
	(3, 'El Salto del Creeper', 89, 69.5, 'salto', 'ygjzCeRFq44'),
	(4, 'El Salto del Laburo', 81, 74.7, 'salto', NULL),
	(5, 'El Salto del Tejado', 86.7, 69.4, 'salto', NULL),
	(6, 'El Salto de la Muerte', 2.3, 70.3, 'salto', 'kBI9xipWbGE'),
	(7, 'El Salto de Aquaman', 45.8, 56, 'salto', 'hFriQ6UuRNg'),
	(8, 'El Salto del Papu', 18.3, 73.7, 'salto', 'AIVY_IFHvCw'),
	(9, 'El Salto del Minipapu', 30, 62, 'salto', 'MKPjVS155lw'),
	(10, 'El Salto Mini del Minipapu', 21.7, 53, 'salto', NULL),
	(11, 'El Salto de la Bresh', 6, 27.7, 'salto', NULL),
	(12, 'El Salto de la Roca', 23, 27.3, 'salto', NULL),
	(13, 'El Salto del Siglo', 23.5, 27.5, 'salto', NULL),
	(14, 'El Salto del Pony', 43.4, 18, 'salto', NULL),
	(15, 'El Salto del Vaquerito', 39.6, 7.6, 'salto', 'll4Cqp2dyEg'),
	(16, 'El Salto del Marcianito', 53.4, 19, 'salto', 'qXmvHmzUzdQ'),
	(17, 'El Salto de la Mansion', 72.2, 62, 'salto', NULL),
	(18, 'El Salto del Rapero', 50.6, 69, 'salto', '6DMM6yXBHhA');

