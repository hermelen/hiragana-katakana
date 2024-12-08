INSERT INTO auth_user
    (id, username, email, password, is_admin)
values (gen_random_uuid(), 'admin', 'hermelen.peris@gmail.com', 'admin', true),
       (gen_random_uuid(), 'hermelen', 'hermelen.peris@synergee.com', 'hermelen', false)