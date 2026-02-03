-- Migration to add Vietnamese language support to books, audios, and videos tables

-- Update books table to include Vietnamese
ALTER TABLE books 
DROP CONSTRAINT IF EXISTS books_language_check;

ALTER TABLE books 
ADD CONSTRAINT books_language_check 
CHECK (language IN ('english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'vietnamese'));

-- Update audios table to include Vietnamese
ALTER TABLE audios 
DROP CONSTRAINT IF EXISTS audios_language_check;

ALTER TABLE audios 
ADD CONSTRAINT audios_language_check 
CHECK (language IN ('english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'vietnamese'));

-- Update videos table to include Vietnamese
ALTER TABLE videos 
DROP CONSTRAINT IF EXISTS videos_language_check;

ALTER TABLE videos 
ADD CONSTRAINT videos_language_check 
CHECK (language IN ('english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'vietnamese'));

