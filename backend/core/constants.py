ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('teacher', 'Teacher'),
    ('student', 'Student'),
    ('guardian', 'Guardian'),
    ('staff', 'Staff'),
]

SHIFT_CHOICES = [
    ('morning', 'Morning'),
    ('day', 'Day'),
    # ('all', 'All'),
    # ('afternoon', 'Afternoon'),
    # ('evening', 'Evening'),
]
EDUCATION_TYPE = [
    ('primary', 'Primary'),
    ('general_high_school', 'General High School'),
    ('vocational', 'Vocational'), 
    ('madrasa', 'Madrasa'), 
    ('collage', 'Collage'), 
]

GROUP_CHOICES = [
    ('science', 'বিজ্ঞান'),
    ('humanities', 'মানবিক'),
    ('commerce', 'ব্যবসায় শিক্ষা'),
    ('common', 'সাধারণ'),
]

SECTION_CHOICES = [
    ('a', 'ক'),
    ('b', 'খ'),
    ('c', 'গ'),
    ('d', 'ঘ'),
    ('e', 'ঙ'),
    ('f', 'চ'),
    ('g', 'ছ'),
    ('h', 'জ'),
    ('i', 'ঝ'),
    ('j', 'ঞ'),
    ('k', 'ট'),
    ('l', 'ঠ'),
    ('m', 'ড'),
    ('common', 'সাধারণ'),
]

# Other common constants
GENDER_CHOICES = (
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other'),
)