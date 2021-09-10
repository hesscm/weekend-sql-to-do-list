CREATE TABLE "list" (
	"id" SERIAL PRIMARY KEY,
    "note" VARCHAR (280),
	"category" VARCHAR (30),
	"priority" INTEGER,
	"isComplete" BOOLEAN,
  "timeCompleted" DATE
);

INSERT INTO "list" 
	("note", "category", "priority", "isComplete", "timeCompleted") 
VALUES 
	('Take out the garbage', 'Chores', 4, true, '2021-09-09');
INSERT INTO "list" 
	("note", "category", "priority", "isComplete") 
VALUES 
	('Complete to-do list assignment', 'School', 1, false);

SELECT * FROM "list";