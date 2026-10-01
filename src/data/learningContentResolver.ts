import { StructuredLearningContent, Subject } from '../types/curriculum';

// Real verified URL mapping database for DSA, SQL, OS, CN, LLD, System Design
const REAL_RESOURCES: Record<string, {
  practice?: { title: string; platform: string; url: string; difficulty: 'Easy' | 'Medium' | 'Hard' };
  learn?: { title: string; url: string; source: string };
  reference?: { title: string; url: string; source: string };
}> = {
  'majority element-i': {
    practice: { title: 'Majority Element', platform: 'LeetCode', url: 'https://leetcode.com/problems/majority-element/', difficulty: 'Easy' },
    learn: { title: "Boyer-Moore Voting Algorithm", url: 'https://www.geeksforgeeks.org/boyer-moore-majority-voting-algorithm/', source: 'GeeksforGeeks' },
    reference: { title: 'Boyer-Moore Majority Vote Algorithm Research', url: 'https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_majority_vote_algorithm', source: 'Wikipedia' }
  },
  'majority element-ii': {
    practice: { title: 'Majority Element II (Elements > n/3)', platform: 'LeetCode', url: 'https://leetcode.com/problems/majority-element-ii/', difficulty: 'Medium' },
    learn: { title: 'Extended Boyer-Moore Voting Algorithm', url: 'https://www.geeksforgeeks.org/majority-element-ii/', source: 'GeeksforGeeks' }
  },
  "kadane's algorithm": {
    practice: { title: 'Maximum Subarray', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/', difficulty: 'Medium' },
    learn: { title: "Kadane's Algorithm Explained", url: 'https://neetcode.io/problems/maximum-subarray', source: 'NeetCode' },
    reference: { title: 'Maximum Subarray Problem', url: 'https://en.wikipedia.org/wiki/Maximum_subarray_problem', source: 'Wikipedia' }
  },
  '3 sum': {
    practice: { title: '3Sum', platform: 'LeetCode', url: 'https://leetcode.com/problems/3sum/', difficulty: 'Medium' },
    learn: { title: 'Two Pointers Technique for 3Sum', url: 'https://neetcode.io/problems/three-integer-sum', source: 'NeetCode' }
  },
  '4 sum': {
    practice: { title: '4Sum', platform: 'LeetCode', url: 'https://leetcode.com/problems/4sum/', difficulty: 'Medium' },
    learn: { title: 'K-Sum Generalization', url: 'https://www.geeksforgeeks.org/find-four-numbers-with-some-sum/', source: 'GeeksforGeeks' }
  },
  'trapping rainwater': {
    practice: { title: 'Trapping Rain Water', platform: 'LeetCode', url: 'https://leetcode.com/problems/trapping-rain-water/', difficulty: 'Hard' },
    learn: { title: 'Two Pointers & Monotonic Stack for Rain Water', url: 'https://neetcode.io/problems/trapping-rain-water', source: 'NeetCode' }
  },
  'sort an array of 0s, 1s, and 2s': {
    practice: { title: 'Sort Colors (Dutch National Flag)', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'Medium' },
    learn: { title: 'Dutch National Flag Algorithm', url: 'https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/', source: 'GeeksforGeeks' }
  },
  'lru cache': {
    practice: { title: 'LRU Cache Implementation', platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/', difficulty: 'Medium' },
    learn: { title: 'Doubly Linked List + HashMap for O(1) LRU', url: 'https://neetcode.io/problems/lru-cache', source: 'NeetCode' },
    reference: { title: 'Cache Replacement Policies', url: 'https://en.wikipedia.org/wiki/Cache_replacement_policies', source: 'Wikipedia' }
  },
  'lfu cache': {
    practice: { title: 'LFU Cache Implementation', platform: 'LeetCode', url: 'https://leetcode.com/problems/lfu-cache/', difficulty: 'Hard' },
    learn: { title: 'LFU Cache with Min-Frequency Tracking', url: 'https://www.geeksforgeeks.org/least-frequently-used-lfu-cache-implementation/', source: 'GeeksforGeeks' }
  },
  'number of islands': {
    practice: { title: 'Number of Islands', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium' },
    learn: { title: 'BFS & DFS Connected Components', url: 'https://neetcode.io/problems/count-number-of-islands', source: 'NeetCode' }
  },
  "dijkstra's algorithm": {
    practice: { title: 'Network Delay Time', platform: 'LeetCode', url: 'https://leetcode.com/problems/network-delay-time/', difficulty: 'Medium' },
    learn: { title: "Dijkstra's Shortest Path Algorithm", url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', source: 'GeeksforGeeks' },
    reference: { title: "Dijkstra's Algorithm Specification", url: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm', source: 'Wikipedia' }
  },
  'tcp i: connection setup and numbering': {
    learn: { title: 'What is a TCP Three-Way Handshake?', url: 'https://www.cloudflare.com/learning/ddos/glossary/tcp-3-way-handshake/', source: 'Cloudflare Learning' },
    reference: { title: 'RFC 9293 - Transmission Control Protocol (TCP)', url: 'https://datatracker.ietf.org/doc/html/rfc9293', source: 'IETF' }
  },
  'dns': {
    learn: { title: 'What is DNS? How DNS Works', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/', source: 'Cloudflare Learning' },
    reference: { title: 'Domain Name System - MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Glossary/DNS', source: 'MDN' }
  },
  'java basics': {
    learn: { title: 'Java Basics Tutorial', url: 'https://www.w3schools.com/java/default.asp', source: 'W3Schools' },
    practice: { title: 'Java Practice on HackerRank', platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/java', difficulty: 'Easy' },
    reference: { title: 'Java Tutorial by Oracle', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html', source: 'Oracle' }
  },
  'what is oop?': {
    learn: { title: 'Java OOP Concepts', url: 'https://www.w3schools.com/java/java_oop.asp', source: 'W3Schools' },
    practice: { title: 'Java OOP Practice', platform: 'Coding Ninjas', url: 'https://www.codingninjas.com/studio/guided-paths/oop-in-java', difficulty: 'Easy' },
    reference: { title: 'Object-Oriented Programming in Java', url: 'https://www.baeldung.com/java-oop', source: 'Baeldung' }
  },
  'singleton design pattern': {
    learn: { title: 'Singleton Pattern in Java / C++', url: 'https://refactoring.guru/design-patterns/singleton', source: 'Refactoring Guru' },
    reference: { title: 'Double-Checked Locking in Java', url: 'https://www.baeldung.com/java-singleton-double-checked-locking', source: 'Baeldung' }
  },
  'rate limiting': {
    learn: { title: 'Rate Limiting Algorithms & Architecture', url: 'https://www.cloudflare.com/learning/bots/what-is-rate-limiting/', source: 'Cloudflare Learning' },
    reference: { title: 'Token Bucket & Leaky Bucket Algorithms', url: 'https://en.wikipedia.org/wiki/Token_bucket', source: 'Wikipedia' }
  },
  'osi model': {
    learn: { title: 'What is the OSI Model? 7 Layers Explained', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/', source: 'Cloudflare Learning' }
  },
  'deadlock in operating systems': {
    learn: { title: 'Deadlock Conditions and Coffman Criteria', url: 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/', source: 'GeeksforGeeks' },
    reference: { title: 'Operating Systems: Three Easy Pieces (Concurrency)', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', source: 'University of Wisconsin' }
  }
};

export function getStructuredLearningContent(topicId: string, title: string, subject: Subject): StructuredLearningContent {
  const lower = title.toLowerCase().trim();
  const known = REAL_RESOURCES[lower];

  // Specific content generator based on subject and pattern
  const content = buildTopicDetails(title, subject, lower);

  // High quality resources with strict fallback to reputable docs
  const resources = [
    {
      title: known?.learn?.title || `${title} - In-Depth Guide & Conceptual Guide`,
      url: known?.learn?.url || getDefaultLearnUrl(subject, title),
      type: 'LEARN' as const,
      sourceName: known?.learn?.source || getDefaultLearnSource(subject),
    },
    {
      title: known?.practice?.title || `${title} - Interview Practice Problem`,
      url: known?.practice?.url || getDefaultPracticeUrl(subject, title),
      type: 'PRACTICE' as const,
      sourceName: known?.practice?.platform || (subject === 'SQL' ? 'LeetCode SQL' : subject === 'DSA' ? 'LeetCode' : 'GeeksforGeeks'),
    },
    {
      title: known?.reference?.title || `${title} - Technical Reference & Standards`,
      url: known?.reference?.url || getDefaultReferenceUrl(subject, title),
      type: 'REFERENCE' as const,
      sourceName: known?.reference?.source || getDefaultReferenceSource(subject),
    }
  ];

  return {
    topicId,
    topicTitle: title,
    whatIsIt: content.whatIsIt,
    whyItMatters: content.whyItMatters,
    coreIdeas: content.coreIdeas,
    whatShouldIKnow: content.whatShouldIKnow,
    commonQuestions: content.commonQuestions,
    commonMistakes: content.commonMistakes,
    exampleIntuition: content.exampleIntuition,
    practiceProblem: known?.practice || {
      title: `Practice: ${title}`,
      platform: subject === 'SQL' ? 'LeetCode' : subject === 'DSA' ? 'LeetCode' : 'GeeksforGeeks',
      url: getDefaultPracticeUrl(subject, title),
      difficulty: 'Medium'
    },
    resources,
  };
}

function getDefaultLearnUrl(subject: Subject, title: string): string {
  const encoded = encodeURIComponent(title.replace(/[^\w\s]/g, '').trim());
  switch (subject) {
    case 'DSA':
      return `https://neetcode.io/practice`;
    case 'SQL':
    case 'DBMS':
      return `https://www.postgresql.org/docs/current/index.html`;
    case 'Computer Networks':
      return `https://www.cloudflare.com/learning/network-layer/what-is-a-protocol/`;
    case 'Operating Systems':
      return `https://pages.cs.wisc.edu/~remzi/OSTEP/`;
    case 'Java / OOP':
      return `https://www.w3schools.com/java/`;
    case 'LLD':
      return `https://refactoring.guru/design-patterns`;
    case 'System Design':
      return `https://github.com/donnemartin/system-design-primer`;
    case 'Security':
      return `https://owasp.org/www-project-top-ten/`;
    case 'Web / APIs':
      return `https://developer.mozilla.org/en-US/docs/Web/HTTP`;
    case 'Concurrency':
      return `https://docs.oracle.com/javase/tutorial/essential/concurrency/`;
    default:
      return `https://www.geeksforgeeks.org/`;
  }
}

function getDefaultLearnSource(subject: Subject): string {
  switch (subject) {
    case 'DSA': return 'NeetCode';
    case 'SQL': case 'DBMS': return 'PostgreSQL Docs';
    case 'Computer Networks': return 'Cloudflare Learning';
    case 'Operating Systems': return 'OSTEP University Material';
    case 'Java / OOP': return 'W3Schools Java';
    case 'LLD': return 'Refactoring Guru';
    case 'System Design': return 'System Design Primer';
    case 'Security': return 'OWASP Foundation';
    case 'Web / APIs': return 'MDN Web Docs';
    case 'Concurrency': return 'Oracle Concurrency Guide';
    default: return 'GeeksforGeeks';
  }
}

function getDefaultPracticeUrl(subject: Subject, title: string): string {
  if (subject === 'DSA') {
    return `https://leetcode.com/problemset/all/`;
  }
  if (subject === 'SQL') {
    return `https://leetcode.com/studyplan/top-sql-50/`;
  }
  if (subject === 'Java / OOP') {
    return `https://www.hackerrank.com/domains/java`;
  }
  return `https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions`;
}

function getDefaultReferenceUrl(subject: Subject, title: string): string {
  switch (subject) {
    case 'DSA':
      return `https://en.wikipedia.org/wiki/List_of_algorithms`;
    case 'SQL':
    case 'DBMS':
      return `https://use-the-index-luke.com/`;
    case 'Computer Networks':
      return `https://www.rfc-editor.org/`;
    case 'Operating Systems':
      return `https://wiki.osdev.org/`;
    case 'Java / OOP':
      return `https://www.baeldung.com/java`;
    case 'Security':
      return `https://csrc.nist.gov/`;
    default:
      return `https://developer.mozilla.org/`;
  }
}

function getDefaultReferenceSource(subject: Subject): string {
  switch (subject) {
    case 'DSA': return 'Algorithm Specification';
    case 'SQL': case 'DBMS': return 'Use The Index, Luke!';
    case 'Computer Networks': return 'IETF RFCs';
    case 'Operating Systems': return 'OSDev Reference';
    case 'Java / OOP': return 'Baeldung Java';
    case 'Security': return 'NIST Computer Security';
    default: return 'MDN Documentation';
  }
}

function buildTopicDetails(title: string, subject: Subject, lower: string) {
  // DSA topic
  if (subject === 'Java / OOP') {
    return {
      whatIsIt: `${title} is a Java fundamentals or object-oriented programming concept meant to help you build correct programs from first principles before jumping into algorithm-heavy interviews.`,
      whyItMatters: `This is the right foundation for beginners: understanding variables, classes, methods, inheritance, and polymorphism makes every later DSA or backend topic easier to reason about. Strong Java basics also help you write cleaner interview code and debug faster.`,
      coreIdeas: [
        'Start with syntax and data types before worrying about optimization. Build simple working programs first.',
        'Use classes, objects, and methods to model real-world entities instead of writing procedural code everywhere.',
        'Understand inheritance, encapsulation, abstraction, and polymorphism as practical design tools, not just theory.',
        'Practice writing small programs from scratch and tracing them line by line.'
      ],
      whatShouldIKnow: `You should be comfortable with variables, loops, conditionals, arrays, methods, constructors, classes, access modifiers, and basic inheritance hierarchies. Learn by writing small examples rather than memorizing docs.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What is the difference between a class and an object in Java?`, answerHint: 'A class is the blueprint; an object is an instance created from that blueprint.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `How does inheritance help you reduce duplication in ${title}?`, answerHint: 'It lets child classes reuse parent behavior and add only the differences.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `When would you choose abstraction or interfaces over concrete implementation?`, answerHint: 'Use interfaces to define behavior while hiding implementation details.' },
        { id: 'q4', level: 'DEEP' as const, question: `How do access modifiers and method overriding affect polymorphism and code safety?`, answerHint: 'Discuss public/private/protected, method signatures, and dynamic dispatch.' }
      ],
      commonMistakes: [
        'Writing overly long methods instead of breaking logic into smaller reusable functions.',
        'Using inheritance when composition is cleaner and easier to maintain.',
        'Ignoring constructors, default values, and object initialization order.',
        'Treating OOP as memorization instead of modeling real problems with clear responsibilities.'
      ],
      exampleIntuition: `Imagine creating a Student object with name, grade, and studyPlan. The class defines the blueprint, while each actual student instance has its own values. Later, a Teacher or Mentor class can reuse common behavior without rewriting the same logic.`
    };
  }

  if (subject === 'DSA') {
    return {
      whatIsIt: `${title} is a core algorithmic problem / data structure technique focused on optimal time and space complexity tradeoffs. It tests candidate capability in finding invariants, reducing redundant scans, and choosing appropriate container primitives.`,
      whyItMatters: `Extremely popular in SDE-1 / SDE-2 screening rounds at Tier-1 tech firms and FAANG. Interviewers look for whether you jump straight into code or clarify constraints, analyze edge cases, and systematically reduce O(N^2) brute force to O(N) or O(N log N).`,
      coreIdeas: [
        'Identify base state, loop invariants, and boundary conditions.',
        'Evaluate if two-pointers, sliding window, or hashing eliminates nested loops.',
        'Analyze space complexity: auxiliary vs in-place mutations.',
        'Verify termination conditions to avoid off-by-one errors and infinite loops.'
      ],
      whatShouldIKnow: `Must know how to trace the solution on paper with dry runs, state exact Big-O for both Time and Space, handle null/empty arrays, duplicates, and integer overflow.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What is the brute-force approach for ${title}, and what is its time complexity?`, answerHint: 'Explain the naive nested iteration or recursion.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `Can you solve ${title} in O(N) time or using O(1) extra auxiliary memory?`, answerHint: 'Think about space-time tradeoffs and invariants.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `How would your solution adapt if data arrives as an infinite stream?`, answerHint: 'Discuss reservoir sampling, min-heaps, or sliding window counters.' },
        { id: 'q4', level: 'DEEP' as const, question: `What are the subtle edge cases that break standard implementations of ${title}?`, answerHint: 'Consider empty collections, negative values, and integer boundaries.' }
      ],
      commonMistakes: [
        'Failing to validate empty array or single-element inputs.',
        'Modifying input in-place when problem statement assumes immutable data.',
        'Not handling duplicate keys or values correctly.',
        'Miscalculating asymptotic complexity due to hidden library calls.'
      ],
      exampleIntuition: `Walk through a miniature example: Input: [2, 1, 2]. Track state transitions step-by-step to show how the decision rule maintains the candidate answer without backtracking.`
    };
  }

  // SQL topic
  if (subject === 'SQL') {
    return {
      whatIsIt: `${title} is an essential relational database query capability. It allows precise filtering, aggregation, correlation, and manipulation of tabular datasets according to relational algebra operations.`,
      whyItMatters: `Standard technical round question for backend, data engineering, and full-stack positions. Interviewers evaluate whether you understand set operations, null semantics, query optimization, and execution order.`,
      coreIdeas: [
        'Understand logical execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
        'Differentiate row-level filtering from aggregated group filtering.',
        'Keep three-valued logic (TRUE, FALSE, UNKNOWN) in mind when encountering NULLs.',
        'Know how index utilization (B-Tree index scans vs sequential scans) impacts query performance.'
      ],
      whatShouldIKnow: `Be fluent with SQL syntax, understand Cartesian product implications, know when to use window functions vs subqueries, and how to write clean, formatted SQL.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What is the syntax and purpose of ${title}?`, answerHint: 'Explain with basic SELECT ... clauses.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `How does NULL handling affect the outcome of ${title}?`, answerHint: 'Explain three-valued logic and IS NULL vs equals.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `How can this query be optimized if the underlying table has 50 million rows?`, answerHint: 'Discuss indexing, covering indexes, and avoiding full table scans.' },
        { id: 'q4', level: 'DEEP' as const, question: `How does the database engine plan and execute ${title} under the hood?`, answerHint: 'Discuss EXPLAIN ANALYZE, hash joins, and sorting operations.' }
      ],
      commonMistakes: [
        'Using WHERE instead of HAVING for aggregated conditions.',
        'Selecting non-aggregated columns without including them in GROUP BY.',
        'Assuming COUNT(col) counts NULL rows (only COUNT(*) counts NULLs).',
        'Accidental cross-join Cartesian blowup caused by missing ON join conditions.'
      ],
      exampleIntuition: `Imagine querying an Employees table: Filter active departments first, apply group summarization, and filter out groups with fewer than 5 members before ordering by salary descending.`
    };
  }

  // Computer Networks
  if (subject === 'Computer Networks') {
    return {
      whatIsIt: `${title} is a fundamental networking protocol or architectural mechanism that facilitates reliable, secure, or routed communication across distributed networked hosts and autonomous systems.`,
      whyItMatters: `Crucial for systems, backend, and infrastructure interviews. You will frequently be asked: "What happens when you type google.com into your browser?" or "How does packet loss trigger retransmissions?"`,
      coreIdeas: [
        'Locate the exact layer within the OSI 7-layer and TCP/IP 4-layer models.',
        'Understand encapsulation: headers, payloads, framing, and packet fragmentation.',
        'Analyze state machine transitions, handshakes, and teardowns.',
        'Distinguish latency from bandwidth, and throughput from round-trip time (RTT).'
      ],
      whatShouldIKnow: `Memorize packet flow, header fields (IP, TCP/UDP), state machines (SYN, SYN-ACK, ACK, FIN, RST), and how routing and ARP resolve logical IP addresses to physical MAC addresses.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `At which layer of the OSI model does ${title} operate?`, answerHint: 'Identify Physical, Data Link, Network, Transport, or Application layer.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `What problem does ${title} solve that prior or alternative protocols could not?`, answerHint: 'Discuss reliability, addressing, latency, or congestion.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `Walk through the exact packet exchange sequence when ${title} is initiated.`, answerHint: 'Detail SYN/ACK flags, sequence numbers, and timeouts.' },
        { id: 'q4', level: 'DEEP' as const, question: `How does ${title} behave under high packet loss, congestion collapse, or asymmetric routing?`, answerHint: 'Discuss congestion windows, exponential backoff, and fast retransmit.' }
      ],
      commonMistakes: [
        'Confusing Transport Layer (ports, flow control) with Network Layer (IP routing, hops).',
        'Thinking UDP is "broken TCP" rather than a low-overhead, connectionless datagram protocol.',
        'Ignoring MTU and MSS packet fragmentation limits.',
        'Assuming DNS answers are guaranteed to be immediate without local OS/browser caching.'
      ],
      exampleIntuition: `Think of postal mail: The envelope address is IP, the apartment number is the Port, the return receipt is TCP ACK, and the mail truck routes through regional hubs via BGP/OSPF.`
    };
  }

  // Operating Systems
  if (subject === 'Operating Systems') {
    return {
      whatIsIt: `${title} is a core operating system primitive or mechanism responsible for resource management, memory safety, hardware abstraction, or concurrency control between executing programs.`,
      whyItMatters: `Standard OS questions appear in virtually every undergraduate CS recruitment drive. Interviewers use this to differentiate candidates who truly understand low-level machine execution from those who only know syntax.`,
      coreIdeas: [
        'Understand the boundary between User Mode (Ring 3) and Kernel Mode (Ring 0).',
        'Learn how Context Switching preserves CPU register state in the Process Control Block (PCB).',
        'Analyze synchronization primitives and race condition prevention.',
        'Trace memory mapping from Virtual Address space to Physical RAM via page tables and TLB.'
      ],
      whatShouldIKnow: `Understand process states (Ready, Running, Blocked), scheduling tradeoffs (throughput vs latency vs fairness), and the difference between threads (shared memory space) and processes (isolated memory space).`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What is the primary role of ${title} in modern operating systems?`, answerHint: 'Explain resource arbitration, isolation, or scheduling.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `What is the difference between a process context switch and a thread context switch?`, answerHint: 'Address space switching, TLB invalidation, and register swapping.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `How does the kernel handle ${title} without causing deadlock or starvation?`, answerHint: 'Mention aging, priority inversion protocols, and lock hierarchies.' },
        { id: 'q4', level: 'DEEP' as const, question: `What happens at the hardware level (interrupts, CPU registers) when ${title} is invoked?`, answerHint: 'Discuss trap instructions, IDT, stack pointer switch, and system calls.' }
      ],
      commonMistakes: [
        'Believing threads do not share heap memory or file descriptors.',
        'Confusing preemptive scheduling with non-preemptive cooperative scheduling.',
        'Forgetting that spinlocks waste CPU cycles when threads are preempted on single-core systems.',
        'Assuming fork() duplicates all physical memory immediately (ignoring Copy-On-Write).'
      ],
      exampleIntuition: `Think of a multi-user kitchen: The OS is the head chef managing access to the stove (CPU) and pantry (RAM), ensuring no cook steals another's ingredients or causes a bottleneck.`
    };
  }

  // LLD / Design Patterns
  if (subject === 'LLD') {
    return {
      whatIsIt: `${title} is a low-level object-oriented software design pattern or architecture technique designed to make code modular, loosely coupled, maintainable, and extensible without breaking existing functionality.`,
      whyItMatters: `LLD interviews are now mandatory for high-tier internships and product companies. Interviewers ask candidates to write clean, extensible code for real-world systems (e.g. Parking Lot, Vending Machine, Elevator) following SOLID principles.`,
      coreIdeas: [
        'Follow SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
        'Favor composition over inheritance to avoid fragile class hierarchies.',
        'Separate object creation from object usage.',
        'Encapsulate what varies so business logic changes do not cascade.'
      ],
      whatShouldIKnow: `Be ready to produce UML class diagrams, define clean interfaces, apply appropriate behavioral/structural/creational design patterns, and handle concurrency safely.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What problem does ${title} solve, and which design pattern category does it belong to?`, answerHint: 'Identify Creational, Structural, or Behavioral.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `How does ${title} adhere to the Open-Closed Principle?`, answerHint: 'Show how new features can be added via new classes without modifying existing code.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `How would you make ${title} thread-safe in a multi-threaded server environment?`, answerHint: 'Discuss synchronizing critical blocks, double-checked locking, or volatile variables.' },
        { id: 'q4', level: 'DEEP' as const, question: `What are the drawbacks or anti-patterns of overuse of ${title}?`, answerHint: 'Over-engineering, extra indirection, and harder stack trace debugging.' }
      ],
      commonMistakes: [
        'Over-engineering simple requirements with unnecessary layers of factories and interfaces.',
        'Violating Liskov Substitution Principle by throwing UnsupportedOperationException in subclasses.',
        'Tight coupling between concrete classes instead of programming to interfaces.',
        'Not accounting for thread safety when singleton or shared state is utilized.'
      ],
      exampleIntuition: `Think of electrical plugs and sockets: An adapter pattern allows a two-prong US plug to connect to a three-prong UK outlet without rewiring the building's electrical grid.`
    };
  }

  // Concurrency & Multithreading
  if (subject === 'Concurrency') {
    return {
      whatIsIt: `${title} is a fundamental synchronization mechanism or concurrency problem dealing with coordinating multiple threads of execution accessing shared resources simultaneously without corruption or deadlock.`,
      whyItMatters: `High-frequency interview topic for Java/C++/Go backend roles. Bugs in concurrency (race conditions, livelocks, deadlocks) are notorious for causing production outages.`,
      coreIdeas: [
        'Mutual exclusion guarantees only one thread enters the critical section at a time.',
        'Atomicity, Visibility, and Ordering are the three pillars of the Java/Hardware Memory Model.',
        'Atomic operations (Compare-and-Swap) enable lock-free high-throughput concurrency.',
        'Condition variables and semaphores allow thread signaling and resource counting.'
      ],
      whatShouldIKnow: `Understand the 4 conditions for Deadlock (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait), know the difference between volatile and synchronized, and master wait()/notify() or Lock/Condition APIs.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What is a race condition, and how does ${title} prevent it?`, answerHint: 'Explain interleaving of read-modify-write operations.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `What is the difference between a Mutex, a Binary Semaphore, and a Counting Semaphore?`, answerHint: 'Ownership, signaling capability, and permit counts.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `Explain the 4 Coffman conditions for deadlock and how to break each.`, answerHint: 'Discuss lock ordering, tryLock timeouts, and resource preemption.' },
        { id: 'q4', level: 'DEEP' as const, question: `How does CAS (Compare-And-Swap) operate at the CPU cache coherence level (MESI protocol)?`, answerHint: 'Discuss bus locking, cache line states, and optimistic lock-free loops.' }
      ],
      commonMistakes: [
        'Thinking volatile provides atomicity for compound operations like count++ (it only provides visibility & ordering).',
        'Calling wait() outside of a synchronized block or without checking the condition inside a while loop.',
        'Acquiring locks in inconsistent orders across different threads, leading to deadlock.',
        'Holding locks during long I/O operations, destroying application throughput.'
      ],
      exampleIntuition: `Think of a single-stall restroom: The door lock is a mutex. If you have a key, you are in. When finished, you unlock and exit so the next person in line can enter.`
    };
  }

  // DBMS
  if (subject === 'DBMS') {
    return {
      whatIsIt: `${title} is a fundamental relational or distributed database architecture principle ensuring data integrity, durability, storage efficiency, and high concurrency.`,
      whyItMatters: `Standard core topic for all CS technical interviews. Interviewers test your understanding of storage engines, write-ahead logging (WAL), B+ Trees, and transaction isolation guarantees.`,
      coreIdeas: [
        'ACID Properties: Atomicity, Consistency, Isolation, and Durability.',
        'B+ Trees keep data sorted with high fan-out, minimizing disk/SSD I/O seek times.',
        'Write-Ahead Logging (WAL) ensures durability before data pages are flushed to disk.',
        'Multi-Version Concurrency Control (MVCC) enables readers not to block writers and writers not to block readers.'
      ],
      whatShouldIKnow: `Master Normalization forms (1NF, 2NF, 3NF, BCNF), know why B+ Tree is preferred over Binary Search Trees or Hash Tables for range queries, and understand the 4 ANSI SQL isolation levels.`,
      commonQuestions: [
        { id: 'q1', level: 'BEGINNER' as const, question: `What is ${title}, and what role does it serve in database reliability?`, answerHint: 'Define the core mechanism and problem it solves.' },
        { id: 'q2', level: 'INTERMEDIATE' as const, question: `Why do database storage engines use B+ Trees instead of AVL or Red-Black trees?`, answerHint: 'Disk block size alignment, shallow tree height, and contiguous sequential leaf node traversal.' },
        { id: 'q3', level: 'INTERVIEW' as const, question: `Explain Dirty Read, Non-Repeatable Read, and Phantom Read anomalies.`, answerHint: 'Map each anomaly to Read Uncommitted, Read Committed, Repeatable Read, and Serializable.' },
        { id: 'q4', level: 'DEEP' as const, question: `How does ARIES recovery (Analysis, Redo, Undo) restore database state after an abrupt power failure?`, answerHint: 'Explain log sequence numbers (LSN), dirty page table, and write-ahead log checkpoints.' }
      ],
      commonMistakes: [
        'Confusing candidate keys with primary keys and alternate keys.',
        'Over-normalizing tables in high-read systems without considering join penalties.',
        'Assuming Repeatable Read isolation prevents phantom reads in all SQL databases (MySQL InnoDB uses next-key locks, Postgres uses snapshot isolation).',
        'Creating indexes on low-cardinality columns (e.g. gender or status boolean).'
      ],
      exampleIntuition: `A bank ledger: If money moves from Account A to Account B, both deductions and additions must either complete together or abort completely—no halfway balance loss.`
    };
  }

  // Fallback / General
  return {
    whatIsIt: `${title} is a core computer science topic under ${subject}, providing essential principles for technical interviews and production software engineering.`,
    whyItMatters: `Understanding ${title} enables you to answer foundational technical interview questions with authority, demonstrating solid conceptual grounding and engineering rigor.`,
    coreIdeas: [
      'Understand foundational terminology, definitions, and operational lifecycle.',
      'Know the practical tradeoffs: performance, complexity, reliability, and security.',
      'Analyze failure modes and standard mitigation strategies.',
      'Be able to formulate clear, concise verbal explanations for an interviewer.'
    ],
    whatShouldIKnow: `Be able to define the topic in 2 sentences, diagram its workflow, cite real-world usage, and answer both introductory and edge-case technical interview questions.`,
    commonQuestions: [
      { id: 'q1', level: 'BEGINNER' as const, question: `Can you define ${title} in simple terms?`, answerHint: 'Give a clear 2-sentence elevator pitch.' },
      { id: 'q2', level: 'INTERMEDIATE' as const, question: `What are the primary use cases and benefits of ${title}?`, answerHint: 'Discuss operational advantages and practical applications.' },
      { id: 'q3', level: 'INTERVIEW' as const, question: `What are the common pitfalls or performance bottlenecks associated with ${title}?`, answerHint: 'Discuss scalability limits and recovery strategies.' }
    ],
    commonMistakes: [
      'Giving vague, imprecise definitions.',
      'Not knowing real-world examples or industry applications.',
      'Focusing purely on theory without practical implementation trade-offs.'
    ],
    exampleIntuition: `Visualize how the component fits into a complete end-to-end client-server architecture: request generation, transport, kernel handling, database query, and response rendering.`
  };
}
