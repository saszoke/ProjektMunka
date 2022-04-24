CREATE DATABASE IF NOT EXISTS etterem;
USE etterem;
CREATE TABLE felhasznalok (
    id INT NOT NULL AUTO_INCREMENT,
    felhasznalonev VARCHAR(255),
    jelszo VARCHAR(20),
    vezeteknev VARCHAR(255),
    keresztnev VARCHAR(255),
    admin BOOLEAN,
    PRIMARY KEY (id)
) ENGINE=INNODB;
CREATE TABLE etlap (
    id INT NOT NULL AUTO_INCREMENT,
    nev VARCHAR(255),
    kategoria VARCHAR(50),
    allergenek VARCHAR(255),
    ar INT,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE asztalok (
    id INT NOT NULL AUTO_INCREMENT,
    alsoSzekFoglalt boolean,
    alsoSzekZarolva boolean,
    felsoSzekFoglalt boolean,
    felsoSzekZarolva boolean,
    rendelesAllapot VARCHAR(50),
    PRIMARY KEY (id)
) ENGINE=INNODB;
CREATE TABLE rendeles (
    id INT NOT NULL AUTO_INCREMENT,
    
    PRIMARY KEY (id),
    asztalAzonosito INT,

    INDEX asztal_index (asztalAzonosito),
    FOREIGN KEY (asztalAzonosito)
        REFERENCES asztalok(id)
        ON DELETE CASCADE,
    letrehozva DATE,
    fizetve BOOLEAN,
    visszavonva BOOLEAN

) ENGINE=INNODB;
CREATE TABLE rendelesreszlet (
    id INT,

    rendelesAzonosito INT,

    INDEX rendeles_index (rendelesAzonosito),
    FOREIGN KEY (rendelesAzonosito)
        REFERENCES rendeles(id)
        ON DELETE CASCADE,

    asztalAzonosito INT,

    INDEX asztal_index (asztalAzonosito),
    FOREIGN KEY (asztalAzonosito)
        REFERENCES asztalok(id)
        ON DELETE CASCADE,

    etelDarabszam INT,

    etelAzonosito INT,

    INDEX etel_index (etelAzonosito),
    FOREIGN KEY (etelAzonosito)
        REFERENCES etlap(id)
        ON DELETE CASCADE
) ENGINE=INNODB;
ALTER TABLE `rendelesreszlet` CHANGE `id` `id` INT(11) NULL DEFAULT NULL AUTO_INCREMENT, add PRIMARY KEY (`id`);
ALTER TABLE `felhasznalok` ADD UNIQUE(`felhasznalonev`);
ALTER TABLE `asztalok` ADD `aktivRendeles` INT NOT NULL AFTER `rendelesAllapot`;
ALTER TABLE `rendeles` CHANGE `letrehozva` `letrehozva` DATE NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `rendeles` CHANGE `fizetve` `fizetve` TINYINT(1) NULL DEFAULT '0';
ALTER TABLE `rendeles` CHANGE `visszavonva` `visszavonva` TINYINT(1) NULL DEFAULT '0';


INSERT INTO `asztalok`(`id`, `alsoSzekFoglalt`, `alsoSzekZarolva`, `felsoSzekFoglalt`, `felsoSzekZarolva`, `rendelesAllapot`) VALUES ('1','0','0','0','0','idle');
INSERT INTO `asztalok`(`id`, `alsoSzekFoglalt`, `alsoSzekZarolva`, `felsoSzekFoglalt`, `felsoSzekZarolva`, `rendelesAllapot`) VALUES ('2','0','0','0','0','idle');
INSERT INTO `asztalok`(`id`, `alsoSzekFoglalt`, `alsoSzekZarolva`, `felsoSzekFoglalt`, `felsoSzekZarolva`, `rendelesAllapot`) VALUES ('3','0','0','0','0','idle');
INSERT INTO `asztalok`(`id`, `alsoSzekFoglalt`, `alsoSzekZarolva`, `felsoSzekFoglalt`, `felsoSzekZarolva`, `rendelesAllapot`) VALUES ('4','0','0','0','0','idle');
INSERT INTO `asztalok`(`id`, `alsoSzekFoglalt`, `alsoSzekZarolva`, `felsoSzekFoglalt`, `felsoSzekZarolva`, `rendelesAllapot`) VALUES ('5','0','0','0','0','idle');