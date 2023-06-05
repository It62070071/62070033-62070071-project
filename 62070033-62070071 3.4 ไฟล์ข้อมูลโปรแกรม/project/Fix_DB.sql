-- MySQL Workbench Forward Engineering

SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`level`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`level` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `rank` INT(11) UNSIGNED NOT NULL,
  `required_points` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `weight` FLOAT(5,2) UNSIGNED NOT NULL,
  `dob` DATE NOT NULL,
  `created` DATE NOT NULL,
  `reward_points` INT(11) UNSIGNED NOT NULL DEFAULT '0',
  `level_id` INT(11) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_users_level1_idx` (`level_id` ASC),
  CONSTRAINT `fk_users_level1`
    FOREIGN KEY (`level_id`)
    REFERENCES `mydb`.`level` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`daily_total`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`daily_total` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `drinks` VARCHAR(20) NOT NULL,
  `date` DATE NOT NULL,
  `total` INT(11) UNSIGNED NOT NULL,
  `users_id` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `uc_daily_total_user_date_drink` (`users_id` ASC, `date` ASC, `drinks` ASC),
  INDEX `users_id_idx` (`users_id` ASC),
  CONSTRAINT `users_id`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`drinks_consumption`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`drinks_consumption` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `drinks` VARCHAR(20) NOT NULL,
  `amount` INT(11) UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `users_id` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_drinks_consumption_users_idx` (`users_id` ASC),
  CONSTRAINT `fk_drinks_consumption_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`reward`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`reward` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `cost` INT(11) UNSIGNED NOT NULL,
  `level_id` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_reward_level1_idx` (`level_id` ASC),
  CONSTRAINT `fk_reward_level1`
    FOREIGN KEY (`level_id`)
    REFERENCES `mydb`.`level` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tokens` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `users_id` INT(11) UNSIGNED NOT NULL,
  `token` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `token_UNIQUE` (`token` ASC),
  INDEX `users_id_idx` (`users_id` ASC),
  CONSTRAINT `fk_user_id`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 46
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`user_rewards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`user_rewards` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_redeemed` DATE NOT NULL,
  `users_id` INT(11) UNSIGNED NOT NULL,
  `reward_id` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_user_rewards_users1_idx` (`users_id` ASC),
  INDEX `fk_user_rewards_reward1_idx` (`reward_id` ASC),
  CONSTRAINT `fk_user_rewards_reward1`
    FOREIGN KEY (`reward_id`)
    REFERENCES `mydb`.`reward` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_rewards_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8;

INSERT INTO `level` (`id`, `rank`, `required_points`) VALUES
(1, 0, 0),
(2, 1, 100),
(3, 2, 300),
(4, 3, 500),
(5, 4, 700),
(6, 5, 900),
(7, 6, 1100),
(8, 7, 1300),
(9, 8, 1500),
(10, 9, 1700),
(11, 10, 1900),
(12, 11, 2100),
(13, 12, 2300),
(14, 13, 2500),
(15, 14, 2700),
(16, 15, 2900),
(17, 16, 3100),
(18, 17, 3300),
(19, 18, 3500),
(20, 19, 3700),
(21, 20, 4000);

INSERT INTO `reward` (`id`, `name`, `cost`, `level_id`) VALUES
(1, "Novice", 0, 1),
(2, "Water Sipper", 100, 2),
(3, "Hydration Rookie", 300, 3),
(4, "Thirst Quencher", 500, 4),
(5, "Aqua Enthusiast", 700, 5),
(6, "Water Warrior", 900, 6),
(7, "Liquid Lover", 1100, 7),
(8, "H2O Hero", 1300, 8),
(9, "Hydration Champion", 1500, 9),
(10, "Aqua Addict", 1700, 10),
(11, "Water Wizard", 1900, 11),
(12, "Hydration Guru", 2100, 12),
(13, "Fluid Master", 2300, 13),
(14, "H2O Magician", 2500, 14),
(15, "Aqua Ace", 2700, 15),
(16, "Water Connoisseur", 2900, 16),
(17, "Hydration Prodigy", 3100, 17),
(18, "Fluid Conqueror", 3300, 18),
(19, "H2O Legend", 3500, 19),
(20, "Hydration Demigod", 3700, 20),
(21, "Water Deity", 4000, 21);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
