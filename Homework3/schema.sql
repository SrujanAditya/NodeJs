create table User(
    id PRIMARY KEY,
    login VARCHAR (100) UNIQUE NOT NULL,
    password VARCHAR (200) NOT NULL,
    age integer NOT NULL,
    isDeleted boolean
)

Select * from User where id = '';

insert into User values('000',"admin@gmail.com","$2b$10$Ajb0x8QNrZem7/eOkXh9M.Xj1P1CbZPbgHuCt4K.hSoJ01Mm.ALBm",22,false);

update User set isDeleted="true" where id = '000';

delete from User where id = "000";
