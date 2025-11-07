import inspect, re

def varname(p):
  for line in inspect.getframeinfo(inspect.currentframe().f_back)[3]:
    m = re.search(r'\bvarname\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)', line)
    if m:
      return m.group(1)

def debug(var1=None, var2=None, var3=None):
  if var1:
    print(f"=====================//// {varname(var1)} Start////======================\n\n")
    print(f"\t\t: {var1}")
    print(f"=====================//// {var1} End////======================\n\n")
  if var2:
    print(f"=====================//// {var2} Start////======================\n\n")
    print(f"\t\t: {var2}")
    print(f"=====================//// {var2} End////======================\n\n")
  if var3:
    print(f"=====================//// {var3} Start////======================\n\n")
    print(f"\t\t: {var3}")
    print(f"=====================//// {var3} End////======================\n\n")