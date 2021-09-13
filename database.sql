CREATE TABLE "list" (
	"id" SERIAL PRIMARY KEY,
    "note" VARCHAR (280),
	"category" VARCHAR (30),
	"priority" INTEGER,
	"isComplete" BOOLEAN,
  "timeCompleted" DATE
);

INSERT INTO "list" 
	("note", "category", "priority") 
VALUES 
	('Take out the garbage', 'Chores', 1),
	('Cook Dinner', 'Chores', 3),
	('Fix Up LinkedIn', 'School', 4),
	('Play with the cats', 'Personal', 5),
	('Complete to-do list assignment', 'School', 1),
    ('Take kids to the playground', 'Personal', 2);

SELECT * FROM "list";