create table medicine (
	id int primary key auto_increment,
    nev varchar(255) unique not null,
    hatoanyag varchar(255)
);