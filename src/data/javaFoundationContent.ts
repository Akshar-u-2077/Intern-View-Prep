import type { LearningContent } from '../types/learningContent';

const JAVA_FIRST_STEPS = 'https://dev.java/learn/first-steps/';
const JAVA_LANGUAGE_BASICS = 'https://dev.java/learn/language/constructs/';
const JAVA_OOP = 'https://dev.java/learn/language/oop/';

export const javaFoundationContent: Record<string, LearningContent> = {
  's1_d1_t2_java-basics': {
    topicId: 's1_d1_t2_java-basics',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Java is a statically typed language: every variable has a declared type, and the compiler checks many mistakes before the program runs. A Java program is compiled into bytecode and then executed by the JVM.',
    whyItMatters: 'A clear mental model of variables, operators, control flow, and arrays makes compiler errors understandable and keeps beginner Java code readable.',
    sections: [
      {
        title: 'Primitive values and references',
        explanation: 'Primitive types such as int, double, boolean, and char store their value directly. Reference types such as String and arrays store a reference to an object or memory location. null means the reference currently points to nothing.',
        example: 'int score = 90; String name = "Aisha"; String missing = null;',
        takeaway: 'The type tells Java what kind of value is legal and what operations are valid.'
      },
      {
        title: 'Operators and conditionals',
        explanation: 'Arithmetic operators such as +, -, *, / and comparison operators such as ==, <, > control numeric work and decisions. if-else statements choose which code path runs.',
        example: 'if (score >= 80) { System.out.println("Pass"); } else { System.out.println("Retry"); }',
        takeaway: 'Operators produce values; conditionals use those values to decide what happens next.'
      },
      {
        title: 'Loops and methods',
        explanation: 'A for loop repeats a block a fixed number of times. A while loop repeats while a condition stays true. Methods group a set of statements so they can be reused with a name.',
        example: 'for (int i = 0; i < 3; i++) { System.out.println(i); }',
        takeaway: 'Loops repeat work and methods package work into reusable behavior.'
      },
      {
        title: 'Arrays, strings, and null',
        explanation: 'Arrays hold multiple values of the same type, such as int[] marks = {70, 80, 90};. String is a reference type, so you can compare content with equals(), not with ==. null is a valid reference value, but it must be handled before calling methods on it.',
        example: 'String name = "Java"; if (name != null && name.equals("Java")) { System.out.println("match"); }',
        takeaway: 'Arrays and strings are common beginner structures, and null is a reminder that references may be absent.'
      },
      {
        title: 'Compile time versus runtime',
        explanation: 'javac checks code structure and types before the program starts. The JVM then runs the compiled bytecode. A mismatch such as adding a string to an int may fail at compile time; a divide-by-zero or null access often fails during execution.',
        takeaway: 'Ask whether the issue was caught by the compiler or discovered while the program was running.'
      }
    ],
    examples: [{
      title: 'Score loop with conditional logic',
      setup: 'A program can calculate whether a list of scores is passing overall.',
      walkthrough: [
        'Create an int[] called scores with several numbers.',
        'Loop over each score and add it to a running total.',
        'Use an if condition to decide whether the average is above a threshold.',
        'Print the final result once the loop ends.'
      ],
      takeaway: 'This pattern combines operators, loops, arrays, and conditionals in a typical beginner program.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone', filename: 'Basics.java',
      title: 'Static types, conditionals, and a loop',
      code: ['public class Basics {', '    public static void main(String[] args) {', '        int[] scores = {88, 76, 91};', '        int total = 0;', '        for (int score : scores) {', '            total += score;', '        }', '        double average = total / (double) scores.length;', '        if (average >= 85) {', '            System.out.println("Pass");', '        } else {', '            System.out.println("Review");', '        }', '    }', '}'].join('\n'),
      explanation: 'The loop reads each score and accumulates it in total. The condition checks the computed average and decides which branch to print. The cast to double keeps the division accurate.',
      expectedOutput: 'Pass'
    }],
    commonMistakes: ['Using == to compare String values instead of equals().', 'Forgetting that arrays and String are reference types, not primitive values.', 'Calling a method on a null reference and getting a NullPointerException.', 'Mixing up assignment (=) with equality comparison (==).'],
    interviewNotes: ['What is the difference between a primitive and a reference type?', 'When does Java report a compile-time error versus a runtime error?', 'Why is null considered a valid reference value?'],
    quickChecks: [{
      question: 'Which statement best describes a reference variable?',
      options: ['It always stores an object inline', 'It stores a reference to an object', 'It can only store primitive values', 'It is checked only at runtime'],
      correctAnswer: 'It stores a reference to an object',
      explanation: 'A reference variable points to an object, while the actual object lives elsewhere in memory.'
    }, {
      question: 'What is the output of 5 / 2 in Java?',
      options: ['2.5', '2', '3', '5'],
      correctAnswer: '2',
      explanation: 'Integer division in Java discards the remainder, so 5 / 2 becomes 2.'
    }],
    practice: [{
      title: 'Practice: beginner Java flow',
      prompt: 'Write a short program that stores three exam scores, computes the average, prints the average, and prints "Pass" when the average is 70 or more. Then modify it to print "Needs improvement" otherwise.',
      expectedSkill: 'Operators, conditionals, loops, arrays, and basic method thinking.'
    }],
    resources: [{ title: 'Java Language Basics', url: JAVA_LANGUAGE_BASICS, type: 'official_docs', description: 'Current official coverage of Java language constructs and beginner concepts.', source: 'Oracle / dev.java' }]
  },
  's1_d4_t5_installation-and-tools': {
    topicId: 's1_d4_t5_installation-and-tools',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 25,
    overview: 'The JDK is the developer toolkit: it includes javac, the compiler, and the Java tools you use to build and run programs. The JVM executes compiled Java bytecode. The JRE is the runtime environment, but most developers install the full JDK.',
    whyItMatters: 'A Java project is easier to troubleshoot when you know which tool is responsible for installation, compilation, execution, and environment setup.',
    sections: [
      {
        title: 'JDK, JRE, and JVM',
        explanation: 'The JDK includes the compiler and development tools. The JRE contains the runtime pieces needed to run Java programs. The JVM is the engine that actually executes the compiled bytecode. In practice, most developers install the JDK because it includes both the compiler and the runtime.' ,
        example: 'java --version -> checks the Java runtime installation\njavac --version -> checks the Java compiler installation',
        takeaway: 'The compiler and runtime are separate concepts even though they work together.'
      },
      {
        title: 'PATH and JAVA_HOME',
        explanation: 'PATH tells your terminal where to find commands like java and javac. JAVA_HOME points to the installed JDK directory and is often used by editors and build tools. If either setup is wrong, you can get “command not found” or the wrong Java version.',
        example: 'JAVA_HOME=C:\\Program Files\\Java\\jdk-21\nPATH=%JAVA_HOME%\\bin;%PATH%',
        takeaway: 'A working Java installation is not just about the files being present; the shell must know where to find them.'
      },
      {
        title: ' IDE setup and compile-run workflow',
        explanation: 'An IDE such as IntelliJ IDEA or VS Code can manage projects and debugging, but the command-line loop is the baseline mental model. You should know: write code, compile it, run it, and read the error output.',
        example: 'javac Hello.java\njava Hello',
        takeaway: 'The IDE is convenience; the compiler and runtime are the actual Java pipeline.'
      },
      {
        title: 'Source-file mode and common problems',
        explanation: 'The source-file mode command java Hello.java is a convenience feature for quick demos. It compiles and runs from the source file in one step, but the standard workflow remains javac Hello.java followed by java Hello. Common problems include wrong JDK version, PATH issues, file naming mismatches, or a class declared public without matching the filename.',
        example: 'public class Hello { ... }',
        takeaway: 'Java is strict about the class name and file name; small setup mistakes often show up immediately.'
      }
    ],
    examples: [{
      title: 'Minimal setup check',
      setup: 'Use these terminal commands to verify that Java is installed correctly.',
      walkthrough: [
        'Run java --version to confirm the runtime is available.',
        'Run javac --version to confirm the compiler is installed.',
        'Create a file named Hello.java with a public class Hello.',
        'Compile it with javac Hello.java.',
        'Run it with java Hello.'
      ],
      takeaway: 'The same setup should work in both a terminal and an IDE; if it does not, the environment is usually the problem.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone', filename: 'Hello.java',
      title: 'A minimal Java program and the standard compile/run flow',
      code: ['public class Hello {', '    public static void main(String[] args) {', '        System.out.println("Hello, Java");', '    }', '}'].join('\n'),
      explanation: 'The file name must match the public class name. javac compiles Hello.java into Hello.class. java Hello invokes the JVM to run the main method in that class.',
      expectedOutput: 'Hello, Java'
    }],
    commonMistakes: ['Typing java Hello.java when the project structure expects javac Hello.java before java Hello.', 'Installing only a JRE and then wondering why javac is missing.', 'Running a class whose source file name does not match the public class.', 'Changing PATH without verifying the terminal is using the right JDK version.'],
    interviewNotes: ['What is the difference between java and javac?', 'Why is JAVA_HOME often set even when the command works without it?', 'When would java Hello.java be useful versus javac + java?'],
    quickChecks: [{
      question: 'Which command checks the Java compiler version?',
      options: ['java --version', 'javac --version', 'java Hello.java', './gradlew test'],
      correctAnswer: 'javac --version',
      explanation: 'javac is the compiler; java is the runtime launcher.'
    }, {
      question: 'What is the main purpose of PATH?',
      options: ['To store Java classes in memory', 'To tell the shell where to find executable commands', 'To compile source files', 'To rename the JDK'],
      correctAnswer: 'To tell the shell where to find executable commands',
      explanation: 'PATH lets your terminal locate commands like java and javac without specifying their full path every time.'
    }],
    practice: [{
      title: 'Practice: local setup check',
      prompt: 'On your machine, run java --version and javac --version. If they fail, fix the JDK installation or PATH configuration and then compile and run a Hello.java program.',
      expectedSkill: 'JDK verification, environment setup, and the standard compile/run workflow.'
    }],
    resources: [{ title: 'Your First Steps in Java', url: JAVA_FIRST_STEPS, type: 'official_docs', description: 'Current official setup and first-program guidance for Java learners.', source: 'Oracle / dev.java' }]
  },
  's1_d4_t7_what-is-oop': {
    topicId: 's1_d4_t7_what-is-oop',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 25,
    overview: 'Object-oriented programming gives you a mental model for representing real-world ideas as objects: each object has state and behavior, and the program organizes related data and logic into cohesive units. A class defines a type, while an object is a concrete instance that stores values and can react to method calls.',
    whyItMatters: 'OOP helps you model systems where data and the rules for changing that data belong together, which makes code easier to reason about and safer to evolve.',
    prerequisites: ['s1_d1_t2_java-basics'],
    sections: [
      {
        title: 'Objects, state, and behavior',
        explanation: 'An object is a bundle of related data and the methods that work on that data. A Student object might hold a name and a count of completed topics, and it might have a method such as markTopicDone().',
        example: 'Student student = new Student(); student.markTopicDone();',
        takeaway: 'Ask what an object knows and what it can do.'
      },
      {
        title: 'Invariants',
        explanation: 'An invariant is a condition that should remain true throughout the life of an object. For example, a bank account should never have a negative balance unless the system explicitly allows overdrafts.',
        example: 'If balance is private, deposit() and withdraw() can enforce the invariant in one place.',
        takeaway: 'The real value of OOP often comes from protecting invariants, not from class syntax alone.'
      },
      {
        title: 'Encapsulation and responsibilities',
        explanation: 'Encapsulation means hiding internal details and exposing a controlled interface. The object decides what valid state looks like instead of letting unrelated code change fields directly.',
        takeaway: 'Good OOP keeps responsibilities together and reduces accidental coupling between classes.'
      }
    ],
    examples: [{
      title: 'Bank account invariants',
      setup: 'A balance value should only change through well-defined operations.',
      walkthrough: [
        'Create a BankAccount class with a private balance field.',
        'Expose deposit() and withdraw() methods instead of public balance assignment.',
        'Inside those methods, reject invalid updates such as negative withdrawals.',
        'The object keeps the rule in one place.'
      ],
      takeaway: 'The invariant is enforced by the object itself, not every caller.'
    }],
    codeExamples: [{ language: 'java', executionMode: 'standalone', title: 'State protected by methods', code: ['class Student {', '    private int completedTopics = 0;', '', '    public void markTopicDone() {', '        completedTopics++;', '    }', '', '    public int getCompletedTopics() {', '        return completedTopics;', '    }', '}', ''].join('\n'), explanation: 'The field is private, so other classes cannot modify it directly. The method marks progress in a controlled way and exposes the value through a safe getter.', expectedOutput: undefined }],
    commonMistakes: ['Treating OOP as a memorized definition without understanding behavior and state.', 'Making everything public and losing control over valid state changes.', 'Creating inheritance only because it feels “object-oriented” rather than because it models a real relationship.'],
    interviewNotes: ['What is an invariant?', 'Why is private state useful even when the field is simple?', 'When is a class a better fit than a primitive or a method alone?'],
    quickChecks: [{ question: 'Which best defines an invariant?', options: ['A method that changes a field', 'A condition that should remain true for valid object state', 'A public constructor', 'A loop that iterates over a list'], correctAnswer: 'A condition that should remain true for valid object state', explanation: 'An invariant is a rule that an object maintains for as long as it is valid.' }],
    practice: [{
      title: 'Practice: identify the invariant',
      prompt: 'For a Student or Account class, list the object state and explain at least one invariant the class should maintain. Then describe one method that enforces it.',
      expectedSkill: 'Object-state modeling and invariant-based design.'
    }],
    resources: [{ title: 'Java Classes and Objects', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html', type: 'official_docs', description: 'Official Java tutorial covering classes, objects, and the relationship between type definitions and instances.', source: 'Oracle Java tutorials' }]
  },
  's1_d5_t3_classes-and-objects': {
    topicId: 's1_d5_t3_classes-and-objects',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 30,
    overview: 'A class is a blueprint or type definition; an object is a concrete instance created from that blueprint. The class describes the structure of the data and behavior, while each object created with new holds its own independent state.',
    whyItMatters: 'This is the core distinction that makes Java code understandable: the class tells you what kind of thing exists, while each object holds its own actual values and responds to method calls.',
    prerequisites: ['s1_d4_t7_what-is-oop'],
    sections: [
      {
        title: 'Class and instance',
        explanation: 'A class declares fields and methods. An instance is created with new and gets memory for its own state. Two objects created from the same class can have different values in their fields.',
        example: 'Counter first = new Counter(); Counter second = new Counter();',
        takeaway: 'The class is the template; each object is a live instance with its own state.'
      },
      {
        title: 'Object creation and method calls',
        explanation: 'The expression new Counter() creates an object and invokes a constructor. The variable stores a reference to that object. When you call first.increment(), Java uses the object referenced by first as the receiver.',
        example: 'first.increment();',
        takeaway: 'The reference tells Java which instance should receive the method call.'
      },
      {
        title: 'Fields and default values',
        explanation: 'Fields are declared inside a class and usually get default initial values if you do not assign them explicitly. Constructors are used to establish a meaningful initial state, but not every field must be set manually in every object.',
        takeaway: 'The class defines the shape; the constructor and method logic define initial and valid state.'
      }
    ],
    examples: [{
      title: 'Two independent counters',
      setup: 'Each Counter instance should keep its own count.',
      walkthrough: [
        'Create a Counter class with an int value field.',
        'Create two objects: first and second.',
        'Call first.increment().',
        'Print first.value and second.value.',
        'Notice that the two objects do not share the same field value.'
      ],
      takeaway: 'The same class is reused, but each object owns its own memory for its instance fields.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Class blueprint with two object instances',
      code: ['class Counter {', '    int value = 0;', '', '    void increment() {', '        value++;', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        Counter first = new Counter();', '        Counter second = new Counter();', '        first.increment();', '        System.out.println(first.value);', '        System.out.println(second.value);', '    }', '}'].join('\n'),
      explanation: 'new Counter() creates a new object with its own value field. first.increment() changes only first.value, leaving second.value unchanged.',
      expectedOutput: '1\n0'
    }],
    commonMistakes: ['Saying a class is a concrete object instead of a blueprint.', 'Assuming objects created from the same class share the same instance fields.', 'Forgetting that new creates an object and calls the constructor.'],
    interviewNotes: ['What does the new keyword do?', 'Why does each object have its own field values?', 'How do method calls know which object is the receiver?'],
    quickChecks: [{ question: 'After new Counter() runs, which statement is true?', options: ['The class is copied into memory', 'A new object instance exists', 'The method is assigned to a variable', 'A primitive value is created'], correctAnswer: 'A new object instance exists', explanation: 'new creates a new object and returns a reference to it.' }],
    practice: [{
      title: 'Practice: model two independent objects',
      prompt: 'Create a Counter class with an integer value and an increment() method. Make two Counter objects, call increment() on only one, and explain why the second object still has its original value.',
      expectedSkill: 'Understanding object identity, instance state, and class-based object creation.'
    }],
    resources: [{ title: 'Classes and Objects', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html', type: 'official_docs', description: 'Official Java tutorial covering how classes create object instances and how instance state differs across objects.', source: 'Oracle Java tutorials' }]
  },
  's1_d6_t16_constructors': {
    topicId: 's1_d6_t16_constructors',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 30,
    overview: 'A constructor is a special method used when a new object is created. It establishes the object’s initial state and usually ensures required values are present before other code begins using the object.',
    whyItMatters: 'Constructors make object creation explicit; they make invalid object states less likely and improve readability at the call site.',
    prerequisites: ['s1_d5_t3_classes-and-objects'],
    sections: [
      {
        title: 'Constructor purpose',
        explanation: 'A constructor has the same name as the class, no return type, and runs automatically as part of object creation. It is the place to initialize fields and validate important inputs.',
        example: 'Student student = new Student("Mira");',
        takeaway: 'Constructors answer the question: “What valid state should this new object start in?”'
      },
      {
        title: 'this and field assignment',
        explanation: 'When a constructor parameter and a field have the same name, this.name refers to the field and name refers to the parameter. This makes the assignment explicit and prevents accidental shadowing bugs.',
        example: 'this.name = name;',
        takeaway: 'this is the current object, and it clarifies which value you are assigning where.'
      },
      {
        title: 'Default constructors and chaining',
        explanation: 'If you do not declare any constructor, Java can create a no-argument constructor automatically. Once you declare a constructor, Java does not automatically create a no-argument one unless you write it. Constructor chaining can call another constructor using this(...) or super(...).',
        takeaway: 'Construction logic should be deliberate, especially when multiple initialization paths exist.'
      }
    ],
    examples: [{
      title: 'Student construction flow',
      setup: 'A Student object should require a name as soon as it is created.',
      walkthrough: [
        'Declare a Student class with a private String name field.',
        'Write a constructor that accepts a name parameter.',
        'Set this.name = name inside the constructor.',
        'Create a new Student("Mira").',
        'The object now starts in a valid state.'
      ],
      takeaway: 'The constructor is the boundary between “not created yet” and “ready to use”.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'contextual',
      title: 'Constructor receives inputs and stores them',
      code: ['class Student {', '    private final String name;', '', '    Student(String name) {', '        this.name = name;', '    }', '', '    String getName() {', '        return name;', '    }', '}', '', 'Student student = new Student("Mira");', 'System.out.println(student.getName());'].join('\n'),
      explanation: 'new Student("Mira") calls the constructor, which sets the name field. final prevents name from being reassigned later, so the object keeps a stable identity after construction.',
      expectedOutput: 'Mira'
    }],
    commonMistakes: ['Forgetting that a constructor has no return type.', 'Declaring a parameterized constructor and expecting Java to create a no-arg constructor automatically.', 'Using a constructor for unrelated work such as database setup or file I/O.', 'Naming parameters the same as fields without using this.'],
    interviewNotes: ['When is a constructor called?', 'What does this refer to inside a constructor?', 'Why is a no-arg constructor sometimes still helpful?'],
    quickChecks: [{ question: 'Which statement is true about a Java constructor?', options: ['It must return void', 'It has the same name as its class', 'It is always static', 'It can be inherited'], correctAnswer: 'It has the same name as its class', explanation: 'A constructor shares the class name and initializes a brand-new instance.' }],
    practice: [{
      title: 'Practice: initialize a Student safely',
      prompt: 'Create a Student class with a private name field and a constructor that accepts a name. Make the constructor reject empty strings with an IllegalArgumentException. Then create a valid student and explain why the constructor is the right place to establish valid initial state.',
      expectedSkill: 'Constructing valid objects and using constructors to protect initial object state.'
    }],
    resources: [{ title: 'Creating Objects in Java', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html', type: 'official_docs', description: 'Official Java tutorial covering object creation, constructors, and initialization.', source: 'Oracle Java tutorials' }]
  },
  's2_d1_t5_access-modifiers': {
    topicId: 's2_d1_t5_access-modifiers',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 30,
    overview: 'Access modifiers control which code can use a class, field, or method. They define the boundary of the public API and help enforce encapsulation and correct collaboration between classes.',
    whyItMatters: 'Java is often easier to maintain when internal details are hidden and only the necessary API is exposed.',
    prerequisites: ['s1_d5_t3_classes-and-objects'],
    sections: [
      {
        title: 'public and private',
        explanation: 'public means the member can be accessed from any class that can see the declaring class. private means the member is usable only inside the same class. In practice, fields are often private while methods that manage valid updates are public.',
        example: 'private int balance; public void deposit(int amount) { ... }',
        takeaway: 'Expose operations, not raw state, when callers should follow rules.'
      },
      {
        title: 'protected and package-private',
        explanation: 'protected allows access inside the same package and to subclasses outside the package. If you use no modifier, the member has package-private visibility: only classes in the same package can access it. This is a very important boundary in larger Java projects.',
        example: 'class Parent { protected int id; }',
        takeaway: 'Visibility is not just about the class; package boundaries also matter.'
      },
      {
        title: 'Cross-package protected nuance',
        explanation: 'A protected member is available to a subclass in another package, but not to unrelated classes in that other package. This means the access is inherited through the subclass relationship, not granted to all code in the other package.',
        example: 'A child class can use protected data because it is a subclass. A sibling class in a different package cannot.',
        takeaway: 'protected is a rule about inheritance and package boundaries, not a blanket “visible everywhere” setting.'
      }
    ],
    examples: [{
      title: 'Package-boundary example',
      setup: 'Imagine a bank package and a reporting package.',
      walkthrough: [
        'In the bank package, a class Account has a protected accountId field.',
        'A subclass in the reporting package can read that field through inheritance.',
        'A separate class in the reporting package that is not a subclass cannot access it directly.',
        'A private field remains hidden even to subclasses.'
      ],
      takeaway: 'protected is about controlled inheritance access, not arbitrary access across packages.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Hiding state behind a public API',
      code: ['class Account {', '    private int balance;', '', '    public void deposit(int amount) {', '        if (amount > 0) {', '            balance += amount;', '        }', '    }', '', '    public int getBalance() {', '        return balance;', '    }', '}'].join('\n'),
      explanation: 'balance is private, so other classes cannot assign it directly. deposit() is the controlled path that preserves the account invariant.',
      expectedOutput: undefined
    }],
    commonMistakes: ['Making fields public because it is easiest for now.', 'Assuming protected gives access to all classes in other packages.', 'Using package-private visibility without realizing it is only for the same package.'],
    interviewNotes: ['What is the difference between private and protected?', 'Why do we often keep fields private?', 'How does package-private affect code in another package?'],
    quickChecks: [{ question: 'Which modifier best hides a field from all other classes?', options: ['public', 'protected', 'private', 'static'], correctAnswer: 'private', explanation: 'private limits access to the class that declares the field.' }, {
      question: 'A protected member in another package is accessible to which code?',
      options: ['Any class in the project', 'Only classes in the same package', 'Only subclasses, not unrelated classes', 'Only classes with the same name'],
      correctAnswer: 'Only subclasses, not unrelated classes',
      explanation: 'protected does not grant access to every class in the package or across the codebase.'
    }],
    practice: [{
      title: 'Practice: control access to account state',
      prompt: 'Create a BankAccount class with a private balance field, a public deposit method, and a public getBalance method. Make sure callers cannot set the balance directly and explain why private state plus a public API is safer than exposing the field.',
      expectedSkill: 'Access control, encapsulation, and safe API design.'
    }],
    resources: [{ title: 'Controlling Access to Members', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html', type: 'official_docs', description: 'Official Java tutorial covering private, protected, public, and package-level access control.', source: 'Oracle Java tutorials' }]
  },
  's2_d3_t5_inheritance': {
    topicId: 's2_d3_t5_inheritance',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 35,
    overview: 'Inheritance models an is-a relationship: a subclass extends a superclass and reuses its behavior while adding or overriding what is specific to the subclass.',
    whyItMatters: 'Inheritance explains how code can be shared safely and how polymorphic behavior works in Java, but it only makes sense when the subclass truly is a specialized version of the parent.',
    prerequisites: ['s1_d4_t7_what-is-oop', 's1_d5_t3_classes-and-objects'],
    sections: [
      {
        title: 'Parent and child behavior',
        explanation: 'A Manager is a kind of Employee. It can inherit the fields and methods that apply to all employees, while adding management-specific behavior such as teamSize or hire().',
        example: 'class Manager extends Employee { ... }',
        takeaway: 'Inheritance works best when the subclass is a real specialization of the superclass.'
      },
      {
        title: 'Inherited versus added versus overridden',
        explanation: 'Inherited members are those already defined in the parent and available in the child. Added members are new fields or methods defined only in the child. Overridden methods replace a parent implementation with a child-specific one.',
        example: 'Employee.printPaySlip() vs Manager.printPaySlip()',
        takeaway: 'Clear separation of “same behavior,” “new behavior,” and “changed behavior” makes inheritance easier to reason about.'
      },
      {
        title: 'super and constructor chaining',
        explanation: 'super() calls the parent constructor, and super.methodName() can call an overridden parent method. This is useful when the child adds to the parent state before finishing construction or before the method logic continues.',
        example: 'super(name, salary);',
        takeaway: 'The child should build on the parent state, not ignore it.'
      }
    ],
    examples: [{
      title: 'Employee and Manager relationship',
      setup: 'A Manager can use the Employee base contract while adding a team size.',
      walkthrough: [
        'Create an Employee class with a name, salary, and printPaySlip() method.',
        'Create a Manager subclass that adds a teamSize field and a hire() method.',
        'Use super(name, salary) to initialize the employee data.',
        'Override printPaySlip() to print both the employee details and the management details.',
        'The child extends the parent behavior while customizing it.'
      ],
      takeaway: 'This demonstrates inherited behavior, added behavior, and overridden behavior in one coherent hierarchy.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Employee hierarchy with constructor chaining and method override',
      code: ['class Employee {', '    private final String name;', '    private final double salary;', '', '    Employee(String name, double salary) {', '        this.name = name;', '        this.salary = salary;', '    }', '', '    void printPaySlip() {', '        System.out.println(name + " earns " + salary);', '    }', '}', '', 'class Manager extends Employee {', '    private final int teamSize;', '', '    Manager(String name, double salary, int teamSize) {', '        super(name, salary);', '        this.teamSize = teamSize;', '    }', '', '    @Override', '    void printPaySlip() {', '        super.printPaySlip();', '        System.out.println("Team size: " + teamSize);', '    }', '}'].join('\n'),
      explanation: 'The Employee constructor sets the base state. Manager calls super(name, salary) to initialize that part before setting teamSize. The override customizes the pay slip without discarding the parent behavior.',
      expectedOutput: undefined
    }],
    commonMistakes: ['Using inheritance to share a helper function when composition is a better fit.', 'Forgetting to call super(...) when the parent constructor requires parameters.', 'Overriding a method but not preserving the logical parent contract.'],
    interviewNotes: ['What is inherited in a subclass?', 'When should you choose composition instead of inheritance?', 'What does super() do in a constructor?'],
    quickChecks: [{ question: 'Which relationship is the best fit for extends?', options: ['A “has-a” relationship', 'An “is-a” relationship', 'A package import', 'A local variable'], correctAnswer: 'An “is-a” relationship', explanation: 'Inheritance models a specialized version of the parent type.' }],
    practice: [{
      title: 'Practice: model a hierarchy with a shared contract',
      prompt: 'Create an Employee class and a Manager subclass that extends it. Give the parent a method called displayRole() and override it in the child. Then create an Employee reference pointing to a Manager and explain what happens when the method is called.',
      expectedSkill: 'Inheritance, overriding, and understanding how subclass behavior extends parent behavior.'
    }],
    resources: [{ title: 'Inheritance in Java', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html', type: 'official_docs', description: 'Official Java tutorial explaining inheritance, overriding, and subclass relationships.', source: 'Oracle Java tutorials' }]
  },
  's2_d5_t15_polymorphism': {
    topicId: 's2_d5_t15_polymorphism',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 30,
    overview: 'Polymorphism means many forms. In Java, a parent reference can point to a child object, and the runtime method that executes is chosen based on the actual object type rather than the variable’s declared type.',
    whyItMatters: 'Polymorphism is one of the core ideas behind extensible Java code because callers can depend on a common parent API while different child implementations behave differently.',
    prerequisites: ['s2_d3_t5_inheritance'],
    sections: [
      {
        title: 'Dynamic dispatch',
        explanation: 'Dynamic dispatch is the process by which the JVM chooses the overridden method implementation for the actual object at runtime. The declared type of the variable is important for compile-time checking, but the runtime object decides which implementation runs.',
        example: 'Employee e = new Manager(...); e.printPaySlip();',
        takeaway: 'The variable type tells Java which methods are visible, while the object type decides which version of an overridden method executes.'
      },
      {
        title: 'Overriding versus overloading',
        explanation: 'Overriding replaces an inherited instance method with a child-specific implementation. Overloading means there are multiple methods with the same name but different parameter lists. They are different and often confused by beginners.',
        example: 'printPaySlip() and printPaySlip(int bonus) are overloaded; overriding replaces the inherited behavior for the same method signature.',
        takeaway: 'Polymorphism depends on overriding, while overloading is a different Java feature.'
      },
      {
        title: 'Parent reference, child method',
        explanation: 'A method can accept Employee and work with any subtype. The caller does not need to know the concrete type, because Java resolves the correct overridden method at runtime.',
        example: 'void pay(Employee e) { e.printPaySlip(); }',
        takeaway: 'This is where polymorphism becomes useful in real code: one function can work with many subclasses.'
      }
    ],
    examples: [{
      title: 'One method, multiple concrete implementations',
      setup: 'A payroll method can accept any Employee subtype and call printPaySlip() without checking every subclass.',
      walkthrough: [
        'Create an Employee parent class with a printPaySlip() method.',
        'Create a Manager subclass that overrides printPaySlip().',
        'Store a Manager object in an Employee variable.',
        'Call the method through the Employee reference.',
        'Observe that the Manager version runs.'
      ],
      takeaway: 'The parent reference is stable, but the actual runtime object decides which override executes.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'contextual',
      title: 'Parent reference using a subclass override',
      code: ['class Employee {', '    void printPaySlip() {', '        System.out.println("Employee pay");', '    }', '}', '', 'class Manager extends Employee {', '    @Override', '    void printPaySlip() {', '        System.out.println("Manager pay");', '    }', '}', '', 'Employee employee = new Manager();', 'employee.printPaySlip();'].join('\n'),
      explanation: 'employee is declared as Employee, but the actual object is a Manager. At runtime, Java calls the Manager override because that is the object type, not the declared type.',
      expectedOutput: 'Manager pay'
    }],
    commonMistakes: ['Confusing overloading with overriding.', 'Assuming the declared variable type controls the runtime implementation.', 'Casting too early instead of relying on the parent API when the subclass is a valid subtype.'],
    interviewNotes: ['What is dynamic dispatch?', 'How is overriding different from overloading?', 'Why is a parent reference useful in a collection of subclass objects?'],
    quickChecks: [{ question: 'Which type decides the overridden instance method that runs?', options: ['The package name', 'The variable name', 'The runtime object type', 'The access modifier alone'], correctAnswer: 'The runtime object type', explanation: 'Java resolves overridden instance methods at runtime using the actual object type.' }],
    practice: [{
      title: 'Practice: polymorphic payroll',
      prompt: 'Create an Employee superclass and two subclasses, Manager and Developer. Write a pay(Employee e) method that calls e.printPaySlip() and verify that each subclass produces its own output.',
      expectedSkill: 'Dynamic dispatch, inheritance, and parent-reference design.'
    }],
    resources: [{ title: 'Java Object-Oriented Programming', url: JAVA_OOP, type: 'official_docs', description: 'Official Java materials covering polymorphism, overriding, and inheritance.', source: 'Oracle / dev.java' }]
  },
  's1_d5_t20_attributes-and-methods': {
    topicId: 's1_d5_t20_attributes-and-methods',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 25,
    overview: 'A class combines state and behavior. Attributes, or fields, represent the data that belongs to an object, while methods define the behavior that reads or changes that data. This lesson focuses on how state and behavior work together inside one object.',
    whyItMatters: 'When you understand how an object stores its state and exposes behavior, you can design clearer classes and explain exactly why object-oriented code keeps data and logic together.',
    prerequisites: ['s1_d4_t7_what-is-oop', 's1_d5_t3_classes-and-objects'],
    sections: [
      {
        title: 'Attributes hold object state',
        explanation: 'Attributes are fields declared inside a class. They describe what information the object remembers. For example, a Student object might remember a name and the number of topics completed. Those values are part of the object’s state and are usually private so that other code cannot change them without going through a defined method.',
        example: 'private String name; private int completedTopics;',
        takeaway: 'Attributes describe what the object knows.'
      },
      {
        title: 'Methods define object behavior',
        explanation: 'Methods are blocks of code that perform tasks. They can take parameters, return values, and update object state. A method is how an object does work, such as marking a topic as completed or returning a report. Good methods hide the details and present a clear operation.',
        example: 'public void completeTopic(String topic) { ... }',
        takeaway: 'Methods describe what the object can do.'
      },
      {
        title: 'State and behavior work together',
        explanation: 'The key idea is that fields and methods live together in the same class. The object stores its values in fields, and methods read or update those values to implement behavior. This is the heart of object-oriented design: data and the logic that changes data are kept together.',
        example: 'Student student = new Student("Aisha"); student.completeTopic("Java Basics"); int progress = student.getProgress();',
        takeaway: 'An object’s behavior should be logical for the state it stores.'
      },
      {
        title: 'Good method design',
        explanation: 'A method should usually do one clear task, use parameters when needed, and return a value only when the caller needs a result. Methods that rely on state are especially powerful because they can work from the object’s current values without forcing the caller to manage every detail.',
        takeaway: 'Methods are actions, not just containers of code.'
      }
    ],
    examples: [{
      title: 'Learning progress tracker',
      setup: 'A Student object should track a name and the number of completed topics.',
      walkthrough: [
        'Create a Student class with a private name field and a private int completedTopics field.',
        'Add a method completeTopic(String topicName) that increments the counter and records the topic name in a list or calculates the result.',
        'Add a getProgress() method that returns the completion count.',
        'Create a Student instance, complete a topic, and print the count.',
        'The object state changes because the method updates its fields.'
      ],
      takeaway: 'This models a realistic object: it stores values and exposes behavior that changes those values.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Fields and methods working together in a Student class',
      code: ['class Student {', '    private final String name;', '    private int completedTopics = 0;', '', '    Student(String name) {', '        this.name = name;', '    }', '', '    public void completeTopic(String topic) {', '        System.out.println(name + " completed " + topic);', '        completedTopics++;', '    }', '', '    public int getProgress() {', '        return completedTopics;', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        Student student = new Student("Aisha");', '        student.completeTopic("Java Basics");', '        System.out.println(student.getProgress());', '    }', '}'].join('\n'),
      explanation: 'The name and completedTopics fields represent object state. completeTopic() changes the state, and getProgress() returns the value. The object is responsible for both keeping the data and updating it in a controlled way.',
      expectedOutput: 'Aisha completed Java Basics\n1'
    }],
    commonMistakes: ['Forgetting that fields represent state and methods represent behavior.', 'Exposing raw fields instead of controlling access through methods.', 'Writing very large methods that mix state updates, printing, and validation instead of separating concerns.', 'Trying to use static for instance-specific data without understanding the difference.'],
    interviewNotes: ['What is the difference between an attribute and a method?', 'How does a method interact with object state?', 'Why is it useful to keep fields private and expose behavior through methods?'],
    quickChecks: [{
      question: 'Which part of a class best represents the object’s current state?',
      options: ['A method parameter', 'A field or attribute', 'A loop variable', 'A static import'],
      correctAnswer: 'A field or attribute',
      explanation: 'Attributes store the values that describe the object at a given moment.'
    }, {
      question: 'Why is a getter method useful?',
      options: ['It creates a new object', 'It exposes a controlled way to read state', 'It prevents the class from compiling', 'It always makes the field public'],
      correctAnswer: 'It exposes a controlled way to read state',
      explanation: 'A getter method can return the current value while still keeping the field private and the object logic controlled.'
    }],
    practice: [{
      title: 'Practice: build a simple Student tracker',
      prompt: 'Create a Student class with a name, completedTopics, and a completeTopic method. Then add a getProgress method and print the result after one or two completions. Explain which parts are state and which parts are behavior.',
      expectedSkill: 'Recognizing attributes, methods, object state, and controlled behavior.'
    }],
    resources: [{ title: 'Java Classes and Objects', url: JAVA_OOP, type: 'official_docs', description: 'Official Java guidance covering fields, methods, and object state in class design.', source: 'Oracle / dev.java' }]
  },
  's2_d7_t12_interfaces': {
    topicId: 's2_d7_t12_interfaces',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 30,
    overview: 'An interface is a contract: it declares methods that a class must implement without specifying the full implementation details. A class can implement an interface to promise that it satisfies the required behavior.',
    whyItMatters: 'Interfaces make Java code more flexible because different classes can fulfill the same contract while behaving differently. They are especially useful when you want to treat many implementations through one shared type.',
    prerequisites: ['s2_d1_t5_access-modifiers'],
    sections: [
      {
        title: 'What an interface represents',
        explanation: 'An interface describes behavior that must be available, not how it is implemented. A class that implements the interface agrees to provide these methods. This makes the interface useful for contracts such as “this class can be saved,” “this class can be sorted,” or “this class can process a payment.”',
        example: 'interface PaymentMethod { void pay(double amount); }',
        takeaway: 'An interface defines the contract; the class defines the implementation.'
      },
      {
        title: 'Implementing an interface',
        explanation: 'The implements keyword tells Java that a class provides the required behavior for the interface. A class can be more than one thing, and it can still satisfy an interface contract even when other details differ. The implementing class must provide all methods declared in the interface, unless it is declared abstract.',
        example: 'class CardPayment implements PaymentMethod { ... }',
        takeaway: 'The class promises behavior by implementing all required methods.'
      },
      {
        title: 'Interface references and multiple interfaces',
        explanation: 'A variable can be declared as the interface type, and the actual object can still be a concrete class. This allows code to depend on the contract instead of an exact class. A class can also implement multiple interfaces to combine separate responsibilities.',
        example: 'PaymentMethod method = new CardPayment();',
        takeaway: 'Interfaces let code depend on behavior rather than a single concrete class.'
      },
      {
        title: 'Interface versus inheritance',
        explanation: 'Inheritance is about an is-a relationship, while interfaces describe required behavior. A class can inherit from one parent class but implement many interfaces. This is why interfaces are not simply “another type of inheritance”; they are a separate way to model contracts and shared behavior across unrelated classes.',
        takeaway: 'Use inheritance for a hierarchy and interfaces for a capability or contract.'
      }
    ],
    examples: [{
      title: 'Course tracker with search capability',
      setup: 'Different classes may need to support searching, even if they are not part of the same inheritance hierarchy.',
      walkthrough: [
        'Create an interface Searchable with a search(String query) method.',
        'Create a CourseCatalog class that implements Searchable.',
        'Create a ResourceLibrary class that also implements Searchable.',
        'Store each object in a Searchable reference and call search() through the interface type.',
        'The same code can work with different implementations because both classes satisfy the same contract.'
      ],
      takeaway: 'Interfaces help you write code that depends on behavior, not on one specific class.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Interface contract with multiple implementations',
      code: ['interface Searchable {', '    void search(String query);', '}', '', 'class CourseCatalog implements Searchable {', '    @Override', '    public void search(String query) {', '        System.out.println("Searching courses for: " + query);', '    }', '}', '', 'class ResourceLibrary implements Searchable {', '    @Override', '    public void search(String query) {', '        System.out.println("Searching resources for: " + query);', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        Searchable searchable = new CourseCatalog();', '        searchable.search("Java");', '    }', '}'].join('\n'),
      explanation: 'The Searchable type guarantees that a search(String query) method exists. The concrete class determines how the search is implemented, while the caller depends only on the contract.',
      expectedOutput: 'Searching courses for: Java'
    }],
    commonMistakes: ['Treating interfaces as inheritance instead of a contract.', 'Implementing an interface but forgetting to implement one of its methods.', 'Hiding logic inside the interface rather than keeping the contract small and clear.', 'Using interfaces only for syntactic complexity rather than to model shared capability.'],
    interviewNotes: ['How is an interface different from a class?', 'Why is an interface useful when classes do different things but share a capability?', 'What does it mean to depend on the interface type instead of the concrete class?'],
    quickChecks: [{
      question: 'Which statement best describes an interface?',
      options: ['A concrete class that can be instantiated directly', 'A contract saying which methods must exist', 'A static method group', 'A copy of a superclass'],
      correctAnswer: 'A contract saying which methods must exist',
      explanation: 'An interface describes required behavior without forcing one concrete implementation.'
    }, {
      question: 'Can a class implement more than one interface?',
      options: ['No, only one interface is allowed', 'Yes, a class can implement multiple interfaces', 'Only if the interfaces are abstract classes', 'Only when the class is static'],
      correctAnswer: 'Yes, a class can implement multiple interfaces',
      explanation: 'Java allows one class to implement multiple interfaces, which is a major strength for shared capabilities.'
    }],
    practice: [{
      title: 'Practice: model a shared capability',
      prompt: 'Create an interface named Searchable with a search(String query) method. Then write two classes, CourseCatalog and ResourceLibrary, that both implement it and call them through a Searchable reference. Explain why the interface lets both classes be treated uniformly.',
      expectedSkill: 'Interface design, implementation, and contract-based code reuse.'
    }],
    resources: [{ title: 'Java Interfaces', url: 'https://dev.java/learn/language/oop/', type: 'official_docs', description: 'Official Java OOP materials covering interfaces, contracts, and polymorphic behavior.', source: 'Oracle / dev.java' }]
  },
  's3_d1_t5_static-keyword': {
    topicId: 's3_d1_t5_static-keyword',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 25,
    overview: 'A static member belongs to the class, not to a particular object instance. Static fields share one value across all objects of that class, and static methods can be called through the class name without creating an object.',
    whyItMatters: 'Static members are useful for shared configuration, counters, and helper methods, but they should be used carefully because they do not belong to a single object’s state.',
    prerequisites: ['s1_d5_t3_classes-and-objects', 's1_d6_t16_constructors', 's2_d1_t5_access-modifiers'],
    sections: [
      {
        title: 'Static fields are class-level state',
        explanation: 'A static field is shared by all instances of the class. If one object changes it, every object sees that new value unless something else resets it. This is useful for counters or configuration values that should apply to the whole class rather than one object.',
        example: 'private static int totalUsers = 0;',
        takeaway: 'Static fields are shared; instance fields are object-specific.'
      },
      {
        title: 'Static methods are class-level behavior',
        explanation: 'Static methods can be called using the class name, such as Math.max(3, 7). They are useful for utility logic that does not depend on instance state. A static method cannot directly access instance fields unless it receives an object reference or creates one.',
        example: 'int largest = Math.max(10, 20);',
        takeaway: 'Static methods are about operations, not object-specific data.'
      },
      {
        title: 'Instance versus class-level state',
        explanation: 'An instance field belongs to one particular object. A static field belongs to the class itself. This distinction is crucial: object state changes from one instance to another, while class-level state is shared. A good beginner rule is: if the data belongs to a single person or object, make it instance-level; if it is shared by all objects, consider static.',
        example: 'student.name vs Student.totalStudents',
        takeaway: 'Ask whether the value should differ per object or be shared across the whole class.'
      },
      {
        title: 'Normal use cases for static',
        explanation: 'Static is commonly used for counters, constants, configuration values, and utility methods that do not depend on object state. It is less appropriate for values that differ from one object to another, such as a user’s progress or a student’s personal record.',
        takeaway: 'Use static when the value belongs to the class, not to one object instance.'
      }
    ],
    examples: [{
      title: 'Shared counter across objects',
      setup: 'A class can track how many instances have been created by using a static field.',
      walkthrough: [
        'Create a class TopicSession with a static int totalCreated field.',
        'Increment totalCreated in the constructor so each new object increases the shared count.',
        'Create two TopicSession objects and print the static field.',
        'The field is shared across both objects, even though each object has its own instance state.'
      ],
      takeaway: 'A static field acts like shared class-level state across all instances.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Static counter and static helper method',
      code: ['class TopicSession {', '    private static int totalCreated = 0;', '    private final int sessionId;', '', '    TopicSession() {', '        totalCreated++;', '        sessionId = totalCreated;', '    }', '', '    public static int getTotalCreated() {', '        return totalCreated;', '    }', '', '    public int getSessionId() {', '        return sessionId;', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        TopicSession first = new TopicSession();', '        TopicSession second = new TopicSession();', '        System.out.println(TopicSession.getTotalCreated());', '        System.out.println(first.getSessionId());', '        System.out.println(second.getSessionId());', '    }', '}'].join('\n'),
      explanation: 'totalCreated is static, so it is shared across all TopicSession objects. getTotalCreated() is static because it reads the class-level value rather than any one object’s state. The sessionId field is instance-level because each object has its own id.',
      expectedOutput: '2\n1\n2'
    }],
    commonMistakes: ['Using static for data that should differ from one object to another.', 'Thinking static methods can access instance fields without an object reference.', 'Creating too many static members because a class appears to need “global” state.', 'Forgetting that static fields are shared and therefore can create surprising bugs if they are mutable.'],
    interviewNotes: ['What is the difference between an instance field and a static field?', 'When is a static method a good idea?', 'Why is a static field not a good choice for per-user data?'],
    quickChecks: [{
      question: 'Which member is shared across all instances of a class?',
      options: ['An instance field', 'A parameter', 'A static field', 'A local variable'],
      correctAnswer: 'A static field',
      explanation: 'A static field belongs to the class itself and is shared by all created objects of that class.'
    }, {
      question: 'Can a static method access an instance field directly?',
      options: ['Yes, without any object reference', 'No, it needs an object reference to access instance state', 'Only if the field is final', 'Only in constructors'],
      correctAnswer: 'No, it needs an object reference to access instance state',
      explanation: 'Instance fields belong to a specific object, so static methods cannot use them without an instance to operate on.'
    }],
    practice: [{
      title: 'Practice: shared counter model',
      prompt: 'Create a class called SessionTracker with a static counter for total sessions and an instance field for a session ID. Create two objects, print the total, and explain which value is shared and which value is per-object.',
      expectedSkill: 'Understanding static class state versus instance state.'
    }],
    resources: [{ title: 'Static Keyword in Java', url: JAVA_LANGUAGE_BASICS, type: 'official_docs', description: 'Official Java language docs covering fields, methods, and static members.', source: 'Oracle / dev.java' }]
  },
  's3_d5_t11_object-cloning': {
    topicId: 's3_d5_t11_object-cloning',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 35,
    overview: 'Object cloning means creating a new object that copies the state of an existing one. It is different from assignment, because assignment copies only the reference, while cloning creates a second object instance. In Java, cloning is a deliberate mechanism and must be understood carefully.',
    whyItMatters: 'Cloning is useful when you need a duplicate object with similar state, but it is easy to misuse. A learner needs to understand exactly when a clone is independent and when it still shares nested mutable state with the original object.',
    prerequisites: ['s1_d5_t20_attributes-and-methods', 's2_d1_t5_access-modifiers'],
    sections: [
      {
        title: 'Reference copy versus object clone',
        explanation: 'Assignment does not create a new object. When you write Student copy = original;, both variables refer to the same object instance. A clone creates a new object at runtime. The new object has its own identity, although its field values may begin with values copied from the original.',
        example: 'Student copy = original; // same object\nStudent cloned = original.clone(); // new object',
        takeaway: 'Assignment copies references; cloning creates a new object instance.'
      },
      {
        title: 'Cloneable and Object.clone()',
        explanation: 'The Cloneable marker interface tells Java that this class is allowed to be cloned. The clone() method is inherited from Object and is protected. To use it safely, a class usually overrides it and exposes a public method that calls super.clone().',
        example: 'class Student implements Cloneable { @Override public Student clone() { ... } }',
        takeaway: 'Cloneable marks support for cloning, and the overridden clone() method decides how the copy is produced.'
      },
      {
        title: 'Shallow copy',
        explanation: 'A shallow copy duplicates the top-level field values. Primitive fields are copied by value, but object fields are copied by reference. That means nested mutable objects can still be shared between the original and the clone. This is the biggest beginner trap in Java cloning.',
        example: 'Address address = new Address("Bengaluru"); Student original = new Student("Aisha", address); Student copy = original.clone();',
        takeaway: 'A shallow copy does not necessarily make nested object state independent.'
      },
      {
        title: 'Deep copy and practical caveats',
        explanation: 'A deep copy duplicates nested objects as well, so the clone and original do not share mutable inner state. This is often more correct for objects that contain nested objects. However, cloning is not always the best design. Many Java applications prefer copy constructors, factory methods, or explicit copy logic because cloning has surprising edge cases and a weaker mental model than explicit code.',
        takeaway: 'Cloning is useful, but it must be designed carefully and is not automatically the best choice for every object.'
      }
    ],
    examples: [{
      title: 'Student with an Address object',
      setup: 'A Student has a name and an Address. We want a clone with the same outer values but without accidentally sharing the nested Address instance. ',
      walkthrough: [
        'Create an Address class with a city field and a setter.',
        'Create a Student class that has a name and an Address field.',
        'Implement Cloneable on both classes and override clone().',
        'In Student.clone(), clone the Address object as well before returning the new Student.',
        'Create a student, clone it, and change the city on the clone.',
        'The original student should keep its original city value if the deep-copy logic is correct.'
      ],
      takeaway: 'This example shows the difference between a shallow copy and a true deep copy in a nested object graph.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Deep-cloning a nested Address inside a Student',
      code: ['class Address implements Cloneable {', '    private String city;', '', '    Address(String city) {', '        this.city = city;', '    }', '', '    public String getCity() {', '        return city;', '    }', '', '    public void setCity(String city) {', '        this.city = city;', '    }', '', '    @Override', '    public Address clone() {', '        try {', '            return (Address) super.clone();', '        } catch (CloneNotSupportedException e) {', '            throw new AssertionError(e);', '        }', '    }', '}', '', 'class Student implements Cloneable {', '    private final String name;', '    private Address address;', '', '    Student(String name, Address address) {', '        this.name = name;', '        this.address = address;', '    }', '', '    public Address getAddress() {', '        return address;', '    }', '', '    @Override', '    public Student clone() {', '        try {', '            Student cloned = (Student) super.clone();', '            cloned.address = this.address.clone();', '            return cloned;', '        } catch (CloneNotSupportedException e) {', '            throw new AssertionError(e);', '        }', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        Student original = new Student("Aisha", new Address("Bengaluru"));', '        Student cloned = original.clone();', '', '        cloned.getAddress().setCity("Pune");', '', '        System.out.println(original.getAddress().getCity());', '        System.out.println(cloned.getAddress().getCity());', '    }', '}'].join('\n'),
      explanation: 'The clone() method creates a new Student object. The deep-copy logic also clones the nested Address field so the clone does not share the same address object with the original. Without that extra copy, both objects would point to the same Address instance and changing the city would affect both objects.',
      expectedOutput: 'Bengaluru\nPune'
    }],
    commonMistakes: ['Confusing assignment with cloning.', 'Forgetting to implement Cloneable.', 'Assuming clone() always performs a deep copy.', 'Ignoring nested mutable objects and shared references.', 'Catching CloneNotSupportedException and then silently continuing without a meaningful fallback.'],
    interviewNotes: ['What is the difference between assigning one object reference to another and cloning an object?', 'What does shallow copy mean in Java?', 'When is a deep copy necessary?', 'Why do many Java codebases prefer copy constructors or explicit copy methods over cloning?'],
    quickChecks: [{
      question: 'If Student copy = student; is copy a new object?',
      options: ['Yes, it is a separate instance', 'No, it points to the same object', 'Only if Student implements Cloneable', 'Only if copy is final'],
      correctAnswer: 'No, it points to the same object',
      explanation: 'Assignment duplicates the reference, not the object itself.'
    }, {
      question: 'Which is the main risk of a shallow copy?',
      options: ['It creates a completely new class', 'It can still share nested mutable objects', 'It cannot be used with primitive fields', 'It automatically throws CloneNotSupportedException'],
      correctAnswer: 'It can still share nested mutable objects',
      explanation: 'A shallow copy duplicates the top-level object but keeps inner object references intact.'
    }],
    practice: [{
      title: 'Practice: deep-copy a nested model',
      prompt: 'Create an Employee class that contains an Address and implement cloning so that changing the cloned address city does not affect the original employee. Explain why a shallow copy would fail in this situation and what part of the object graph must be copied separately.',
      expectedSkill: 'Understanding object identity, nested references, and shallow versus deep copy behavior.'
    }],
    resources: [{ title: 'Object Cloning', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/cloning.html', type: 'official_docs', description: 'Official Java tutorial covering object duplication, Cloneable, shallow copy, and deep copy semantics.', source: 'Oracle Java tutorials' }]
  },
  's3_d6_t24_generics': {
    topicId: 's3_d6_t24_generics',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 45,
    overview: 'Generics let a class, interface, or method work with a type parameter instead of one hard-coded type. The compiler checks how that parameter is used, so reusable code can stay type-safe without forcing callers to cast values back to a specific type.',
    whyItMatters: 'Generics make collections and reusable utilities safer and clearer. They catch incompatible values at compile time, remove many casts, and let one implementation work with many related types while preserving the type information the caller expects.',
    prerequisites: ['s1_d5_t3_classes-and-objects', 's1_d5_t20_attributes-and-methods', 's2_d7_t12_interfaces'],
    sections: [
      {
        title: 'Why generics exist',
        explanation: 'Before generics, a collection often stored Object values. Reading a value required a cast, and a wrong value could fail later at runtime. With List<String>, the compiler knows that only String values belong there and get() already returns String. Generics move this check earlier and make the intended type visible at the use site.',
        example: 'Before: String name = (String) names.get(0);\nAfter: String name = names.get(0);',
        takeaway: 'Generics provide type safety, reduce unnecessary casts, and make reusable code easier to read.'
      },
      {
        title: 'Generic classes',
        explanation: 'A generic class declares a type parameter between angle brackets after its class name. The parameter acts as a placeholder inside the class. When a caller creates Box<String>, T becomes String for that object; Box<Integer> uses the same class with T as Integer.',
        example: 'class Box<T> { private T value; }\nBox<String> message = new Box<>();',
        takeaway: 'The class is written once, while each object chooses a concrete type for its parameter.'
      },
      {
        title: 'Generic methods and interfaces',
        explanation: 'A generic method declares its own type parameter before the return type, such as <T> T first(T left, T right). That parameter belongs to the method call, not automatically to the enclosing class. A generic interface applies the same idea to a contract, allowing different implementations to use different concrete types.',
        example: 'static <T> T first(T value) { return value; }\ninterface Converter<T> { T convert(String text); }',
        takeaway: 'Class-level parameters describe an object type; method-level parameters describe one operation; interface parameters describe a typed contract.'
      },
      {
        title: 'Type parameter conventions',
        explanation: 'Names such as T for type, E for element, K for key, and V for value are common conventions. They are ordinary identifiers, not reserved Java keywords. A meaningful name such as <Element> can be clearer when the role is not obvious.',
        example: 'Map<K, V> maps keys to values; List<E> represents a list of elements.',
        takeaway: 'The angle-bracket name communicates a role, but the compiler does not give T, E, K, or V special powers.'
      },
      {
        title: 'Invariance and type safety',
        explanation: 'List<Integer> is not a subtype of List<Number>, even though Integer is a subtype of Number. If it were allowed, code holding a List<Number> could insert a Double into a list that should contain only Integer values. This rule protects the promise made by the original list type.',
        example: 'List<Integer> scores = new ArrayList<>();\n// List<Number> numbers = scores; // does not compile',
        takeaway: 'Generic types are invariant by default; a subtype relationship between element types does not automatically transfer to the generic container.'
      },
      {
        title: 'Wildcards: unknown and bounded views',
        explanation: 'List<?> means a list of some unknown type. You can safely read values as Object, but you cannot add an ordinary value because the exact element type is unknown. List<? extends Number> is a producer view: it can provide Number values, but it is not safe to add a Number. List<? super Integer> is a consumer view: it can safely accept Integer values, while reads are only guaranteed to be Object.',
        example: 'List<?> unknown = List.of("Java", "OOP");\nList<? extends Number> numbers = List.of(1, 2);\nList<? super Integer> sink = new ArrayList<Number>();',
        takeaway: 'Use a wildcard when a method should accept a family of generic types without choosing one exact type parameter.'
      },
      {
        title: 'PECS: Producer Extends, Consumer Super',
        explanation: 'When a method only reads values from a parameter, use extends because the parameter produces values for the method. When a method puts values into a parameter, use super because the parameter consumes those values. The rule is a practical guide for choosing between the two wildcard bounds.',
        example: 'double total(List<? extends Number> values) { ... }\nvoid addScores(List<? super Integer> target) { target.add(100); }',
        takeaway: 'Producer Extends and Consumer Super describes the direction of data flow, not inheritance of the collection itself.'
      },
      {
        title: 'Type bounds',
        explanation: 'A bound restricts which types may be used for a type parameter. In <T extends Number>, T must be Number or a subclass such as Integer or Double. The bound lets the method use operations guaranteed by Number while remaining reusable for several numeric types.',
        example: 'static <T extends Number> double twice(T value) { return value.doubleValue() * 2; }',
        takeaway: 'A bounded type parameter gives reusable code a safe minimum API to rely on.'
      },
      {
        title: 'Type erasure',
        explanation: 'Java generics are mainly a compile-time feature. After the compiler checks the generic code, type parameters are generally erased from the runtime representation. This keeps compatibility with older Java bytecode, but it means code cannot normally ask for T.class or distinguish List<String> from List<Integer> at runtime.',
        example: 'List<String> names = new ArrayList<>();\n// if (value instanceof List<String>) { ... } // not allowed',
        takeaway: 'Generics improve compile-time safety, but generic type arguments are not generally available to runtime type checks.'
      }
    ],
    examples: [{
      title: 'A gradual path from raw values to typed reuse',
      setup: 'The examples move from a reusable container to method and wildcard contracts. Read each one as a separate small Java program.',
      walkthrough: [
        'Start with Box<T> so one class can hold a String, Integer, or another reference type without casts.',
        'Use a generic method to return the first element of a typed array without tying the method to one class.',
        'Use a generic interface when several converters should share the same typed contract.',
        'Use List<? extends Number> when a calculation reads numbers from different numeric lists.',
        'Use List<? super Integer> when a method adds integer scores to a compatible destination.'
      ],
      takeaway: 'Generics become easier when you first identify the type relationship and the direction in which values move.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: '1. Generic class: one container, many safe types',
      code: ['class Box<T> {', '    private T value;', '', '    void set(T value) {', '        this.value = value;', '    }', '', '    T get() {', '        return value;', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        Box<String> text = new Box<>();', '        text.set("Generics");', '        String value = text.get();', '        System.out.println(value);', '    }', '}'].join('\n'),
      explanation: 'T is replaced with String for this object. The compiler prevents an Integer from being stored in text, and get() returns String without a cast.',
      expectedOutput: 'Generics'
    }, {
      language: 'java', executionMode: 'standalone',
      title: '2. Generic method: type parameter belongs to the call',
      code: ['public class Demo {', '    static <T> T first(T left, T right) {', '        return left;', '    }', '', '    public static void main(String[] args) {', '        String word = first("Java", "OOP");', '        Integer number = first(10, 20);', '        System.out.println(word);', '        System.out.println(number);', '    }', '}'].join('\n'),
      explanation: 'The method declares T itself, so one call can infer String and another can infer Integer. No generic class is required.',
      expectedOutput: 'Java\n10'
    }, {
      language: 'java', executionMode: 'standalone',
      title: '3. Generic interface: a typed conversion contract',
      code: ['interface Converter<T> {', '    T convert(String text);', '}', '', 'class ToInteger implements Converter<Integer> {', '    public Integer convert(String text) {', '        return Integer.valueOf(text);', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        Converter<Integer> converter = new ToInteger();', '        System.out.println(converter.convert("42"));', '    }', '}'].join('\n'),
      explanation: 'Converter<T> describes a typed contract. ToInteger fixes T as Integer, so callers know what convert returns through the interface reference.',
      expectedOutput: '42'
    }, {
      language: 'java', executionMode: 'standalone',
      title: '4. Wildcard usage: read from a producer',
      code: ['import java.util.List;', '', 'public class Demo {', '    static double sum(List<? extends Number> values) {', '        double total = 0;', '        for (Number value : values) {', '            total += value.doubleValue();', '        }', '        return total;', '    }', '', '    public static void main(String[] args) {', '        System.out.println(sum(List.of(2, 3, 4)));', '    }', '}'].join('\n'),
      explanation: 'The method can read from List<Integer>, List<Double>, or another Number subtype list. It does not add values because the exact producer element type is unknown.',
      expectedOutput: '9.0'
    }, {
      language: 'java', executionMode: 'standalone',
      title: '5. Bounded type and PECS: read numbers, write integers',
      code: ['import java.util.ArrayList;', 'import java.util.List;', '', 'public class Demo {', '    static <T extends Number> double twice(T value) {', '        return value.doubleValue() * 2;', '    }', '', '    static void addScores(List<? super Integer> target) {', '        target.add(90);', '        target.add(80);', '    }', '', '    public static void main(String[] args) {', '        List<Number> scores = new ArrayList<>();', '        addScores(scores);', '        System.out.println(twice(scores.get(0)));', '    }', '}'].join('\n'),
      explanation: 'The bound allows twice() to call Number.doubleValue(). The super wildcard allows addScores() to consume Integers into a List<Integer>, List<Number>, or List<Object>.',
      expectedOutput: '180.0'
    }],
    commonMistakes: ['Treating T as a concrete class instead of a placeholder for a caller-chosen type.', 'Confusing List<Object>, which is a list specifically typed to Object, with List<?>, which is a list of some unknown type.', 'Assuming List<Integer> can be assigned to List<Number> because Integer extends Number.', 'Reading extends in a wildcard as ordinary class inheritance of the collection itself.', 'Using super without recognizing that the target is consuming values.', 'Using raw types such as List instead of supplying a type argument.', 'Adding casts to generic code instead of expressing the relationship with a type parameter or wildcard.'],
    interviewNotes: ['Why do generics exist? Explain compile-time type safety, fewer casts, and reusable type-parameterized code.', 'What is the difference between a generic class and a generic method? A class parameter belongs to the object type; a method parameter belongs to one method invocation.', 'Why is List<Integer> not a subtype of List<Number>? Invariance prevents code from inserting a Double into a list promised to contain only Integers.', 'What does List<?> mean? It is a list of an unknown type: values can be safely read as Object, but ordinary values cannot be added.', 'What is the difference between extends and super in a wildcard? extends is useful for reading from a producer; super is useful for writing to a consumer.', 'What does PECS mean? Producer Extends, Consumer Super; choose the bound based on the direction of data flow.', 'What is type erasure? The compiler checks type arguments, then generic arguments are generally erased from runtime representation.', 'Why should raw types be avoided? They disable useful compiler checks and bring casts and runtime ClassCastException risk back into the code.'],
    quickChecks: [{
      question: 'Why does this assignment fail: List<Number> numbers = new ArrayList<Integer>();',
      options: ['Integer is not a Number', 'Generic types are invariant by default', 'ArrayList cannot store numbers', 'Number is a primitive type'],
      correctAnswer: 'Generic types are invariant by default',
      explanation: 'Allowing the assignment would let code add a Double through the List<Number> reference to an Integer-only list.'
    }, {
      question: 'A method only reads Number values from its list. Which parameter is the best fit?',
      options: ['List<Object>', 'List<?>', 'List<? extends Number>', 'List<? super Number>'],
      correctAnswer: 'List<? extends Number>',
      explanation: 'The list produces values that are at least Number, so extends allows safe reads from lists of Number subtypes.'
    }, {
      question: 'Which statement about List<?> is correct?',
      options: ['It means the list stores Object values specifically', 'It permits adding any value', 'It represents a list of an unknown type', 'It is the same as a raw List'],
      correctAnswer: 'It represents a list of an unknown type',
      explanation: 'The exact element type is hidden, so the list can be read as Object but cannot accept an arbitrary new element.'
    }, {
      question: 'A method adds Integer values to its parameter. Which wildcard follows PECS?',
      options: ['List<? extends Integer>', 'List<? super Integer>', 'List<Integer extends Number>', 'List<T super Integer>'],
      correctAnswer: 'List<? super Integer>',
      explanation: 'The parameter consumes Integers, so super permits List<Integer>, List<Number>, and List<Object> as destinations.'
    }],
    practice: [{
      title: 'Practice: build a typed collection utility',
      prompt: 'Implement a GenericStack<T> with push(T), pop(), and isEmpty() methods. Then write a static method printNumbers(List<? extends Number>) that prints each value, and a static method addDefaultScores(List<? super Integer>) that adds two Integer scores. Explain why the two wildcard bounds match their different data-flow directions.',
      expectedSkill: 'Designing generic classes and methods, applying invariance, choosing wildcard bounds with PECS, and avoiding raw types and unnecessary casts.'
    }],
    resources: [{ title: 'Generics', url: 'https://dev.java/learn/language/generics/', type: 'official_docs', description: 'Focused official Java learning material covering generic types, methods, wildcards, and type bounds.', source: 'Oracle / dev.java' }]
  },
  's3_d6_t14_exception-handling': {
    topicId: 's3_d6_t14_exception-handling',
    contentVersion: 2,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 35,
    overview: 'An exception represents a problem that occurs while a program is running. Java gives you structured ways to respond to those problems with try, catch, finally, throw, and throws so the program can recover, report, or stop gracefully.',
    whyItMatters: 'Most real applications encounter invalid input, missing data, or resource problems. Exception handling teaches you how to turn unexpected failures into controlled, explainable program behavior instead of crashing without a clear cause.',
    prerequisites: ['s1_d5_t20_attributes-and-methods', 's2_d7_t12_interfaces', 's3_d1_t5_static-keyword'],
    sections: [
      {
        title: 'What an exception is',
        explanation: 'An exception is an object that indicates something unusual happened while the program was running. A method may fail because the input is invalid, a resource cannot be accessed, or a calculation is impossible. Exceptions are a way to represent those problems explicitly so the program can handle them in a meaningful order.',
        example: 'throw new IllegalArgumentException("Name cannot be empty")',
        takeaway: 'Exceptions are not “random errors”; they are structured signals that something unexpected occurred.'
      },
      {
        title: 'try, catch, and finally',
        explanation: 'The try block contains code that might fail. The catch block handles the exception if it occurs. The finally block runs whether or not the exception happened, which makes it useful for cleanup actions such as closing a file or resetting a resource.',
        example: 'try { ... } catch (IllegalArgumentException e) { ... } finally { ... }',
        takeaway: 'Handle the problem near the code that caused it, and use finally for cleanup.'
      },
      {
        title: 'throw versus throws',
        explanation: 'throw creates an exception object and raises it immediately in the current method. throws is part of a method signature and tells callers that the method may propagate an exception. The important difference is that throw triggers the exception in the current block, while throws declares that the method can pass responsibility to the caller.',
        example: 'throw new IllegalStateException("invalid state");\npublic void save() throws IOException { ... }',
        takeaway: 'throw raises the issue; throws declares the possibility that the method may fail.'
      },
      {
        title: 'Handling errors appropriately',
        explanation: 'Good exception handling means deciding whether to recover, retry, log, or stop. Catching any Exception and then ignoring it is usually a bad idea because it hides real problems. Beginners should catch the specific exception they expect and do something meaningful with it.',
        takeaway: 'A catch block should recover, explain, or rethrow the problem intentionally.'
      }
    ],
    examples: [{
      title: 'Progress percentage validation',
      setup: 'A method should reject invalid totals before dividing numbers. If total is zero or negative, the method should raise a clear exception and the caller should catch it gracefully.',
      walkthrough: [
        'Create a method getProgress(int completed, int total) that throws IllegalArgumentException when total <= 0.',
        'Call the method inside a try block.',
        'Catch IllegalArgumentException and print a friendly error message.',
        'Use finally to print that the validation step ended.',
        'The method keeps invalid input from silently producing broken output.'
      ],
      takeaway: 'Exception handling is a controlled way to explain and recover from invalid conditions.'
    }],
    codeExamples: [{
      language: 'java', executionMode: 'standalone',
      title: 'Throwing and catching an invalid-input exception',
      code: ['class ProgressCalculator {', '    static int getProgress(int completed, int total) {', '        if (total <= 0) {', '            throw new IllegalArgumentException("Total must be greater than zero.");', '        }', '        return (completed * 100) / total;', '    }', '}', '', 'public class Demo {', '    public static void main(String[] args) {', '        try {', '            System.out.println(ProgressCalculator.getProgress(3, 0));', '        } catch (IllegalArgumentException e) {', '            System.out.println("Invalid data: " + e.getMessage());', '        } finally {', '            System.out.println("Progress calculation finished.");', '        }', '    }', '}'].join('\n'),
      explanation: 'The method throws an IllegalArgumentException when the input is invalid. The caller catches that specific exception, prints a clear message, and finally runs the cleanup or completion message regardless of success.',
      expectedOutput: 'Invalid data: Total must be greater than zero.\nProgress calculation finished.'
    }],
    commonMistakes: ['Catching Exception and ignoring it.', 'Using throw in the wrong place or confusing it with a method return.', 'Using throws only for documentation without handling the problem at the right layer.', 'Assuming every error should crash the program instead of recovering meaningfully.'],
    interviewNotes: ['What is the difference between throw and throws?', 'Why is finally useful?', 'What is the benefit of catching a specific exception instead of a broad one?'],
    quickChecks: [{
      question: 'Which block is guaranteed to run whether or not an exception occurs?',
      options: ['try', 'catch', 'finally', 'throws'],
      correctAnswer: 'finally',
      explanation: 'finally is used for cleanup and final steps, even when an exception is thrown or handled.'
    }, {
      question: 'What is the main difference between throw and throws?',
      options: ['throw declares a method may fail, throws raises an exception immediately', 'throw raises an exception immediately, throws declares a method may propagate it', 'They are the same concept', 'throws creates a catch block and throw starts a try block'],
      correctAnswer: 'throw raises an exception immediately, throws declares a method may propagate it',
      explanation: 'throw is the actual exception signal; throws informs the caller that the method may pass the responsibility to them.'
    }],
    practice: [{
      title: 'Practice: validate user input',
      prompt: 'Write a method that accepts a student score and throws an IllegalArgumentException if the score is outside 0 to 100. Use try/catch/finally to handle the invalid input and print a meaningful message explaining the issue.',
      expectedSkill: 'Exception raising, catching specific exceptions, and meaningful recovery.'
    }],
    resources: [{ title: 'Exceptions in Java', url: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Exception.html', type: 'official_docs', description: 'Official Java exception hierarchy and language behavior reference for beginner and intermediate learners.', source: 'Oracle / Java SE docs' }]
  }
};

export const structuredJavaTopicIds = Object.keys(javaFoundationContent);
