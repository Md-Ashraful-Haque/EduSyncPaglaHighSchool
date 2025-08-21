const showBangla = (designation) => {
  const designationMap = {
    'Assistant Teacher': 'সহকারী শিক্ষক',
    'Assistant Head Teacher': 'সহকারী প্রধান শিক্ষক',
    'Head Teacher': 'প্রধান শিক্ষক',
    'Lecturer': 'প্রভাষক',
    'Assistant Professor': 'সহকারী অধ্যাপক',
    'Professor': 'অধ্যাপক',
    'Principal': 'প্রিন্সিপাল',
  };

  return designationMap[designation] || designation;
};

export default showBangla;