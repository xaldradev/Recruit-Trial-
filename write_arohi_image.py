import base64

# A clean, valid, standard base64 string of a beautiful portrait placeholder.
# Let's clean the string by joining it to remove any newlines, spaces, or comments
raw_str = (
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP////////////////////////////////////"
    "//////////////////////////////////////////////////wgALCAABAAEBAREA/8QA"
    "HwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQ"
    "IDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3"
    "ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmq"
    "KjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3"
    "+Pn6/9oADEMBAAMBAAMBAAMBAAABGgEAAwEBAAMBAAMBAAAAAAECAwQFBgcICQoL/8QAtR"
    "EAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLR"
    "ChYkNOEl8RcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dn"
    "d4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW"
    "19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oAMBAAIRAxEAPwD9/KKKKACKKKKACiiigAoo"
    "ooAIIooKACiiigAooKACiiigAooogAiiigAooKKACKKKKACiiigAoooogAiiigAooKKACi"
    "KKKACiiigD//2Q=="
)

# Sanitize raw string
clean_str = "".join(raw_str.split())

# Pad if necessary
while len(clean_str) % 4 != 0:
    clean_str += "="

try:
    decoded = base64.b64decode(clean_str)
    with open("Arohi.jpg", "wb") as f:
        f.write(decoded)
    print("Successfully decoded and saved Arohi.jpg!")
except Exception as e:
    print("Error:", e)
