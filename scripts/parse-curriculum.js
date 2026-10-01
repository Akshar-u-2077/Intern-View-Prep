const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Planly-InternView Prep Structure.txt');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split(/\r?\n/);

const sprints = [];
let currentSprint = null;
let currentDay = null;

function categorizeTopic(name) {
  const lower = name.toLowerCase();

  // DSA Patterns
  const dsaPatterns = [
    'element', 'subarray', 'sum', 'array', 'kadane', 'search', 'sort', 'median', 'kth',
    'matrix', 'string', 'parenthes', 'substring', 'subsets', 'combinations', 'queens', 'n-queen',
    'word search', 'sudoku', 'linked list', 'palindrome', 'node', 'nodes', 'tree', 'bst',
    'traversal', 'diameter', 'lca', 'binary tree', 'morris', 'heap', 'heapify', 'stream',
    'islands', 'graph', 'cycle', 'bipartite', 'topological', 'kahn', 'course schedule', 'alien dictionary',
    'kosaraju', 'bridges', 'articulation', 'dijkstra', 'bellman', 'floyd', 'word ladder', 'disjoint set',
    'mst', 'knapsack', 'frog jump', 'ninja', 'unique paths', 'stock', 'coin change', 'subsequence',
    'edit distance', 'wildcard', 'chain multiplication', 'trie', 'xor', 'rabin-karp', 'kmp',
    'z function', 'bit manipulation', 'primes', 'rainwater', 'inversions', 'reverse pairs',
    'koko', 'aggressive cows', 'book allocation', 'rotate', 'next greater', 'stock span',
    'min stack', 'asteroid', 'celebrity', 'jump game', 'candy', 'meetings', 'interval', 'platforms',
    'job sequencing', 'rotten oranges', 'flood fill', 'surrounded regions', 'power set'
  ];

  // LLD & Design Patterns & Object-Oriented Design
  const lldPatterns = [
    'low level design', 'lld', 'design pattern', 'solid', 'single responsibility', 'open-closed',
    'liskov', 'interface segregation', 'dependency inversion', 'uml', 'class diagram', 'singleton',
    'factory', 'builder', 'prototype', 'adapter', 'decorator', 'facade', 'proxy', 'composite',
    'bridge', 'flyweight', 'iterator', 'observer', 'strategy', 'command', 'state pattern',
    'visitor', 'mediator', 'memento', 'chain of responsibility', 'template method',
    'parking lot', 'vending machine', 'atm machine', 'elevator system', 'hotel management',
    'ride booking', 'digital wallet', 'task management', 'music streaming', 'traffic signal',
    'logging framework', 'pubsub system'
  ];

  // System Design
  const sysDesignPatterns = [
    'rate limiting', 'sliding window counter', 'token bucket', 'leaky bucket', 'concurrency limiter',
    'load balancing', 'load balancer', 'cdn', 'caching', 'sharding', 'partitioning',
    'replication', 'cap/pacele', 'distributed', 'what happens when you type google',
    'what happens when you connect to public wi-fi', 'resilient systems', 'warehouse stock'
  ];

  // Security
  const securityPatterns = [
    'security', 'cia triad', 'aaa framework', 'firewall', 'threats', 'idps', 'vpn', 'zero trust',
    'cryptography', 'encryption', 'diffie-hellman', 'hash functions', 'mac and hmac',
    'digital signatures', 'certificate', 'public key infrastructure', 'pki', 'tls and ssl',
    'tls handshake', 'wpa', 'dnssec', 'dns security'
  ];

  // Web & APIs
  const webPatterns = [
    'http', 'rest api', 'websocket', 'cookies', 'sessions, and tokens', 'ftp', 'email protocols',
    'streaming protocols', 'all about apis'
  ];

  // Concurrency & Multithreading
  const concurrencyPatterns = [
    'concurrency', 'parallelism', 'thread', 'threads', 'multithreading', 'race condition',
    'critical section', 'mutual exclusion', 'dekker', 'peterson', 'bakery', 'hardware synchronization',
    'test-and-set', 'compare-and-swap', 'lock', 'locks', 'mutex', 'semaphore', 'condition variables',
    'producer-consumer', 'readers-writers', 'sleeping barber', 'dining philosophers',
    'thread safety', 'thread pools', 'executors', 'deadlock', 'priority inversion',
    'starvation vs deadlock', 'wait-for graph', 'banker'
  ];

  // SQL & Databases
  const sqlKeywords = [
    'sql', 'query', 'queries', 'select', 'where', 'group by', 'having', 'join', 'joins',
    'union', 'intersect', 'order by', 'distinct', 'aliases', 'null vs 0', 'ddl vs dml',
    'insert', 'update', 'delete', 'truncate', 'alter', 'upsert', 'explain', 'grants',
    'privileges', 'revoke', 'subqueries', 'exists', 'correlated subqueries',
    'highest order placing', 'frequent actor', 'first login', 'unique subjects',
    'user follower', 'inactive customers', 'most frequent travellers', 'sales analysis',
    'employees', 'customers', 'students', 'orders', 'bank balances', 'quiet students',
    'safe investment', 'tennis grand slam', 'football team', 'orphan employees',
    'order count', 'immediate first orders', 'transactions', 'top grade', 'swap consecutive'
  ];

  const dbmsKeywords = [
    'database', 'dbms', 'relational', 'er model', 'entity', 'weak entities', 'schema',
    'normalisation', 'normalization', 'normal form', 'functional dependencies', 'armstrong',
    'b-tree', 'b+ tree', 'indexing', 'storage hierarchy', 'pages, records', 'file organization',
    'hashing', 'cost-based query', 'nosql', 'oltp', 'olap', 'acid', 'serializability',
    'schedules', 'two-phase locking', 'write-ahead logging', 'aries', 'shadow paging',
    'recovery', 'savepoint', 'commit', 'rollback'
  ];

  // Operating Systems
  const osKeywords = [
    'operating system', 'os', 'kernel', 'process', 'schedul', 'context switch', 'fcfs',
    'sjf', 'round robin', 'srtf', 'hrrn', 'protection', 'cpu affinity', 'numa',
    'multiprogramming', 'multitasking', 'multiprocessing', 'load balancing in os'
  ];

  // Computer Networks
  const cnKeywords = [
    'network', 'networks', 'packet', 'osi model', 'tcp/ip', 'encapsulation', 'physical layer',
    'transmission media', 'cable', 'twisted pair', 'fiber optic', 'coaxial', 'mac address',
    'error detection', 'csma', 'arp', 'stp', 'spanning tree', 'topology', 'topologies', 'vlan',
    'ethernet', 'switching', 'routing', 'router', 'ipv4', 'ipv6', 'cidr', 'subnetting',
    'ospf', 'rip', 'bgp', 'transport layer', 'udp', 'tcp', 'sliding window', 'port and sockets',
    'nat', 'dhcp', 'dns', 'wi-fi', '802.11', 'circuit switching', 'message switching',
    'mpls', 'bufferbloat', 'qos', 'bdp', 'latency'
  ];

  // Java / OOP
  const javaKeywords = [
    'java', 'oop', 'class', 'classes', 'object', 'constructor', 'access modifier',
    'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface',
    'static keyword', 'object cloning', 'exception handling', 'generics', 'object lifecycle'
  ];

  // Match in specific precedence
  // Explicit exact or high-priority maps
  const explicitMap = {
    'clients, servers and peers': 'Computer Networks',
    'what happens when we open an app?': 'Operating Systems',
    'why do we need layered architecture': 'Computer Networks',
    'how many apps run at the same time?': 'Operating Systems',
    'software design principles': 'LLD',
    'design principles': 'LLD',
    'installation and tools': 'Java / OOP',
    'next permutation': 'DSA',
    'attributes and methods': 'Java / OOP',
    'practice: attributes and methods': 'Java / OOP',
    'full duplex vs half duplex': 'Computer Networks',
    'address resolution protocol': 'Computer Networks',
    'primary key': 'DBMS',
    'foreign key': 'DBMS',
    'everything about keys': 'DBMS',
    'relationships and structural constraints': 'DBMS',
    'relationships, cardinality, and optionality': 'DBMS',
    'virtual lans': 'Computer Networks',
    'ip addressing modes': 'Computer Networks',
    'private vs public ip': 'Computer Networks',
    'importance, raw data and pain': 'DBMS',
    'find nth root of a number': 'DSA',
    'border gateway protocol': 'Computer Networks',
    'views and materialized views': 'DBMS',
    'maximum points you can obtain from cards': 'DSA',
    'max consecutive ones iii': 'DSA',
    'longest repeating character replacement': 'DSA',
    'application layer introduction': 'Computer Networks',
    'comparison operators': 'SQL',
    'logical operators': 'SQL',
    'arithmetic operators': 'SQL',
    'odd non-boring movies': 'SQL',
    'filtering essentials': 'SQL',
    'is null vs is not null, in, and not in': 'SQL',
    'file transfer protocol': 'Computer Networks',
    'between and not between': 'SQL',
    'like and not like': 'SQL',
    'filter records excluding a specific pattern': 'SQL',
    'find records excluding a given set of values': 'SQL',
    'count functions': 'SQL',
    'comparisons between all 3': 'Computer Networks',
    'email duplicates': 'SQL',
    'combine active and archived users': 'SQL',
    'combine sales records without deduplication': 'SQL',
    'reshape products data': 'SQL',
    'metrics deep dive': 'Computer Networks',
    'fixed window counter': 'System Design',
    'remove k digits': 'DSA',
    'largest rectangle in a histogram': 'DSA',
    'maximum rectangles': 'DSA',
    'minimum distance between points': 'DSA',
    'suspended accounts': 'SQL',
    'find team size for each employee': 'SQL',
    'lru cache': 'DSA',
    'average experience by project': 'SQL',
    'lfu cache': 'DSA',
    'available seat streaks': 'SQL',
    'a and b buyers without c': 'SQL',
    'product selling price report': 'SQL',
    'suggested pages': 'SQL',
    'contest participation rate': 'SQL',
    'high-report managers': 'SQL',
    'all-product buyers': 'SQL',
    'highest non-repeating number': 'SQL',
    'find first device logged in by each player': 'SQL',
    'print root-to-leaf path': 'DSA',
    'incomplete employee records': 'SQL',
    'boolean expression evaluator': 'DSA',
    'editing data and tables': 'SQL',
    'system settings': 'Operating Systems',
    'employee salary': 'SQL',
    'dependency injection': 'LLD',
    'why the wrong primary key can quietly destroy you': 'DBMS',
    'shortest path in dag': 'DSA',
    'performance and debugging': 'Operating Systems',
    'path with minimum effort': 'DSA',
    'raw data setup and stored procedures': 'SQL',
    'debugging correctness': 'Operating Systems',
    'grant all and with grant option': 'SQL',
    'making a large island': 'DSA',
    'house robber': 'DSA',
    'timestamp ordering, optimistic control, and mvcc': 'DBMS',
    'declarative integrity beyond keys': 'DBMS',
    'authorization, views, and auditing': 'DBMS',
    'metadata, statistics, maintenance, and observability': 'DBMS',
    'longest word with all prefixes': 'DSA',
    'single number ii': 'DSA',
    'single number iii': 'DSA',
    'find repeating and missing number': 'DSA',
    'test': 'Other'
  };

  if (explicitMap[lower]) {
    return explicitMap[lower];
  }
  for (const p of dsaPatterns) {
    if (lower.includes(p)) return 'DSA';
  }

  // System Design
  for (const p of sysDesignPatterns) {
    if (lower.includes(p)) return 'System Design';
  }

  // LLD
  for (const p of lldPatterns) {
    if (lower.includes(p)) return 'LLD';
  }

  // Security
  for (const p of securityPatterns) {
    if (lower.includes(p)) return 'Security';
  }

  // Web & APIs
  for (const p of webPatterns) {
    if (lower.includes(p)) return 'Web / APIs';
  }

  // Concurrency
  for (const p of concurrencyPatterns) {
    if (lower.includes(p)) return 'Concurrency';
  }

  // SQL
  for (const p of sqlKeywords) {
    if (lower.includes(p)) return 'SQL';
  }

  // DBMS
  for (const p of dbmsKeywords) {
    if (lower.includes(p)) return 'DBMS';
  }

  // Computer Networks
  for (const p of cnKeywords) {
    if (lower.includes(p)) return 'Computer Networks';
  }

  // Operating Systems
  for (const p of osKeywords) {
    if (lower.includes(p)) return 'Operating Systems';
  }

  // Java / OOP
  for (const p of javaKeywords) {
    if (lower.includes(p)) return 'Java / OOP';
  }

  return 'Other';
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Check Sprint
  const sprintMatch = line.match(/^(?:#*\s*)Sprint\s+(\d+)(?:\s*[—–-]\s*(.*))?/i);
  if (sprintMatch) {
    currentSprint = {
      sprintNumber: parseInt(sprintMatch[1], 10),
      title: `Sprint ${sprintMatch[1]}`,
      duration: sprintMatch[2] ? sprintMatch[2].trim() : '',
      days: []
    };
    sprints.push(currentSprint);
    currentDay = null;
    continue;
  }

  // Check Day
  const dayMatch = line.match(/^(?:#*\s*)Day\s+(\d+)(?:\s*[—–-]\s*(.*))?/i);
  if (dayMatch && currentSprint) {
    currentDay = {
      dayNumber: parseInt(dayMatch[1], 10),
      title: `Day ${dayMatch[1]}`,
      duration: dayMatch[2] ? dayMatch[2].trim() : '',
      topics: []
    };
    currentSprint.days.push(currentDay);
    continue;
  }

  // Check Topic
  if (line.startsWith('-') && currentDay) {
    const raw = line.replace(/^-\s*/, '').trim();
    // Check if there is a duration at the end: "Topic Name — 10m 46s"
    const topicParts = raw.split(/\s*[—–-]\s*(?=\d+[hms])/);
    let title = raw;
    let duration = '';
    if (topicParts.length > 1) {
      title = topicParts[0].trim();
      duration = topicParts[1].trim();
    } else {
      // Maybe format like "— 15m"
      const dashIdx = raw.lastIndexOf('—');
      if (dashIdx !== -1) {
        const potentialDur = raw.slice(dashIdx + 1).trim();
        if (/^\d+[hms]/.test(potentialDur)) {
          title = raw.slice(0, dashIdx).trim();
          duration = potentialDur;
        }
      }
    }

    const subject = categorizeTopic(title);
    currentDay.topics.push({
      title,
      duration,
      subject
    });
  }
}

let totalTopics = 0;
const subjectCounts = {};
sprints.forEach(s => {
  s.days.forEach(d => {
    totalTopics += d.topics.length;
    d.topics.forEach(t => {
      subjectCounts[t.subject] = (subjectCounts[t.subject] || 0) + 1;
    });
  });
});

console.log(`Parsed ${sprints.length} sprints, with total ${totalTopics} topics.`);
console.log('Subject Breakdown:', subjectCounts);

const others = [];
sprints.forEach(s => {
  s.days.forEach(d => {
    d.topics.forEach(t => {
      if (t.subject === 'Other') others.push(t.title);
    });
  });
});
console.log('All Other topics:', JSON.stringify(others, null, 2));
