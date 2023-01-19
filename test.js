var ints = [   
    {"type": "regular", "text": "Perhaps the most crucial difference between Python and Java are their type systems: Java is ‘strongly typed’, whereas Python is ‘weakly typed’. We’ll dig a little deeper into what that means here. "},
    {"islinebreak": true, "type": "linebreak"},
    {"type": "regular", "text": "Recall the code from the last lesson: (Left- Python, Right- Java)"},
    {"iscode":true,"language": "python","type": "code", "text": "def print_bigger(a, b):\n    if a > b:\n        print(a)\n    else:\n        print(b)"},
    {"iscode":true,"language": "java","type": "code", "text": "import java.io.*;\n\nvoid printBigger(int a, int b){\n    if (a > b) {\n        System.out.println(a); \n    } else {\n        System.out.println(b); \n    } \n}"},
    {"type": "regular", "text": "Notice the difference in the way we have defined the arguments."},
    {"islinebreak": true, "type": "linebreak"},
    {"type": "regular", "text": "Python:"},
    {"iscode":true,"language": "python","type": "code", "text": "print_bigger(a,b)"},
    {"type": "regular", "text": "Java:"},
    {"iscode":true,"language": "java","type": "code", "text": "printBigger(int a, int b)"},
    {"type": "regular", "text": "This reveals one requirement enforced by Java’s type system: when ‘declaring’ (creating) variables, you must give them a type. The type describes what sort of data the variable stores, must be respected, and cannot be changed.:"},
    {"islinebreak": true, "type": "linebreak"},
    {"type": "regular", "text": "This means that there is no direct way to translate the following Python code into Java:"},
    {"iscode":true,"language": "python","type": "code", "text": "x = 7\nif input() == “y”:\n   x = “yes”\n\nprint(x)"},
    {"type": "regular", "text": "When translating this code to Java, what type should `x` be given? Since we assign an integer to it (`7`), perhaps we should choose `int` (which is Java’s main primitive integer type)? But since we sometimes assign a string to it, should we choose `String` (which is Java’s type for strings)? We cannot do both at the same time, as a variable can have only one type, so we are stuck - this is why the code has no direct translation."},
    {"islinebreak": true, "type": "linebreak"},
    {"type": "regular", "text": "(Note: the typing system in Java is like a strict (enforced) version of the typing hints system Python provides. If you are already used to writing code like:"},
    {"iscode":true,"language": "python","type": "code", "text": "def print_bigger(a : int, b : int) -> None:"},
    {"type": "regular", "text": "Then the transition to Java’s type system will be quite simple. This tutorial will use typing hints liberally.)"},
    {"islinebreak": true, "type": "linebreak"},
    {"type": "regular", "text": "For now, we will only talk about Java’s `int`s, which are very similar to Python’s `int`s. For most purposes, they can be used interchangeably:"},

    {"istable":true, "type": "table", "array": [{" ":"Code Blocks and Control Flow","Python":"Use colons and indentation","Java":"Use opening and closing curly brackets: {, }"},
    {" ":"Semicolons Ending Statements","Python":"Unnecessary (and proscribed)","Java":"Necessary"}
    ]}
]