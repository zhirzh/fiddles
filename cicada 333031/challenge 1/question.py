def encode(message):
    n = len(message)
    x = int(len(message)**(0.5)) + 1
    code = []

    for i in xrange(x):
        code.append([])

        for j in xrange(x):
            k = (x * i) + j
            code[i].append(message[k] if (k < n) else '_')

    code = [''.join(c) for c in zip(*code)]

    return ''.join(code)


def decode(code):
    n = int(len(code)**(0.5))
    message = []

    for i in xrange(n):
        message.append([])

        for j in xrange(n):
            k = (n * i) + j
            message[i].append(code[k])

    message = [''.join(x) for x in zip(*message)]
    return ''.join(message).strip('.')

code = encode('hello')
print len('hello')
print code
# print decode(code)

code = encode('helloworld')
print len('helloworld')
print code
# print decode(code)

code = encode('thisisasecretmessage')
print code
# print decode(code)
