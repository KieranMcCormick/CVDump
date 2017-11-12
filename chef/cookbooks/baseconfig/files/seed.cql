INSERT INTO project.users (username, firstname, lastname, email_address, password) values ('user1', 'Pusheen', 'Cat', 'carl@email.com', '$2a$10$YmmCm0Y112nIUt.HlCJYAe2wzYINvysg8QYnHvu7K9zzUN671WIGO');

INSERT INTO project.users (username, firstname, lastname, email_address, password) values ('user2', 'Joe', 'Smith', 'smith@email.com', '$2a$10$YmmCm0Y112nIUt.HlCJYAe2wzYINvysg8QYnHvu7K9zzUN671WIGO');

INSERT INTO project.users (username, firstname, lastname, email_address, password) values ('user3', 'Bob', 'Jones', 'bob@email.com', '$2a$10$YmmCm0Y112nIUt.HlCJYAe2wzYINvysg8QYnHvu7K9zzUN671WIGO');

INSERT INTO project.documents (uuid, created_at, title, user_id, version) values (c4f47b81-7cfc-4536-8cd2-bbd582794b26, '2017-10-10 00:19:00', 'Resume 1', 'user1', {'1' : '/file/path' });


INSERT INTO project.blocks (label, uuid, created_at, updated_at, documents, summary, user_id) values ('summary 2', uuid(), '2017-01-02', '2017-01-02', {'id': c4f47b81-7cfc-4536-8cd2-bbd582794b26}, textAsBlob('Summary 2'), 'user1');
