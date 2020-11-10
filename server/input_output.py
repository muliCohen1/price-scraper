def read_file(title):
    try:
        read_value = open("records/"+ title +".txt", "r")
        read_value = read_value.read()
    except IOError:
        # print("Creating new record")
        read_value = ''
    return read_value

def write_file(title, price):
    try:
        write_value = open("records/"+ title +".txt", "w")
        write_value.write(price)
        write_value.close()
    except IOError:
        print("Writing error occurred" + IOError)