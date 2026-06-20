PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS things (
    uid         TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    imageURI    TEXT NOT NULL,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    createdAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updatedAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- -----------------------------------------------------------------------------
-- updatedAt triggers
-- -----------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS trg_somethings_updatedAt
    AFTER UPDATE ON things
    FOR EACH ROW
    WHEN NEW.updatedAt IS OLD.updatedAt
BEGIN
    UPDATE things
    SET updatedAt = strftime('%Y-%m-%dT%H:%M:%fZ','now')
    WHERE uid = OLD.uid;
END;