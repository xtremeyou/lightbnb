INSERT INTO users (name, email, password) 
VALUES ('Maverick', 'xtremeyou@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ryan Reynolds', 'ryan@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Hugh Jackman', 'hughie123@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, thumbnail_photo_url, cover_photo_url, active, country, street, city, province, post_code)
VALUES ( 
  1, 
  'Speed lamp', 
  'description', 
  369, 2, 2, 3, 
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 
  TRUE, 
  'Canada', 
  '435 Days Rd', 
  'Kingston', 
  'Ontario', 
  'kyk 35t'
  ),
  ( 
  1, 
  'Blank corner', 
  'description', 
  369, 2, 2, 3, 
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 
  TRUE, 
  'Canada', 
  '893 Acres Dr', 
  'Kingston', 
  'Ontario', 
  'K7K 99tO'
  ),
  ( 
  2, 
  'Habit mix', 
  'description', 
  369, 2, 2, 3, 
  'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 
  TRUE, 
  'Canada', 
  '239 Dinamo Rd', 
  'Kingston', 
  'Ontario', 
  'KJK 45Z'
  );


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('1990-09-11', '1990-09-26', 2, 3), 
('1990-01-04', '1990-02-01', 2, 2), 
('1990-10-01', '1990-10-14', 1, 3);




INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 5, 'messages'),
(2, 2, 2, 4, 'messages'),
(3, 2, 3, 3, 'messages');