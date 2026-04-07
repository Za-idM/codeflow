import { create } from 'zustand';

const BADGES = {
  first_run: { id: 'first_run', name: 'First Run', icon: '🚀', desc: 'Ran your first program' },
  print_master: { id: 'print_master', name: 'Print Master', icon: '📢', desc: 'Completed Level 1: Print Statements' },
  variable_wizard: { id: 'variable_wizard', name: 'Variable Wizard', icon: '📦', desc: 'Completed Level 2: Variables' },
  logic_lord: { id: 'logic_lord', name: 'Logic Lord', icon: '🔀', desc: 'Completed Level 3: If/Else' },
  loop_legend: { id: 'loop_legend', name: 'Loop Legend', icon: '🔁', desc: 'Completed Level 4: For Loops' },
  code_master: { id: 'code_master', name: 'Code Master', icon: '⚡', desc: 'Completed all 5 levels!' },
  speed_runner: { id: 'speed_runner', name: 'Speed Runner', icon: '⚡', desc: 'Completed a challenge in under 1 minute' },
  perfectionist: { id: 'perfectionist', name: 'Perfectionist', icon: '💎', desc: 'Got 100% on any level' },
};

export const LEVELS = [
  {
    id: 1,
    title: 'Print Statements',
    subtitle: 'Say Hello to the World!',
    icon: '📢',
    color: '#06b6d4',
    xpReward: 100,
    badge: 'print_master',
    description: 'Learn how to display text and numbers on screen using print().',
    starterCode: `# Welcome to CodeFlow! 🎉
# Let's start with print statements

print("Hello, World!")
print("My name is CodeFlow")
print(42)
print(3.14)`,
    challenge: {
      title: 'Challenge: Print Your Info',
      description: 'Write code that prints your name, age, and favorite number on separate lines.',
      hint: 'Use print() three times with different values',
      solution: `print("Your Name")
print(18)
print(7)`,
      expectedLines: 3,
      validate: (output) => output.length >= 3,
    },
    concepts: ['print()', 'strings', 'numbers'],
    vizType: 'print',
  },
  {
    id: 2,
    title: 'Variables',
    subtitle: 'Boxes That Store Values',
    icon: '📦',
    color: '#8b5cf6',
    xpReward: 150,
    badge: 'variable_wizard',
    description: 'Variables are like labeled boxes. You can store values and change them!',
    starterCode: `# Variables store data for later use
name = "Alice"
age = 20
score = 0

print(name)
print(age)

# Now let's update them
score = score + 100
age = age + 1

print(score)
print(age)`,
    challenge: {
      title: 'Challenge: Swap Two Variables',
      description: 'Create two variables a=5 and b=10, then swap their values and print both.',
      hint: 'You need a temporary variable to hold one value during the swap',
      solution: `a = 5
b = 10
temp = a
a = b
b = temp
print(a)
print(b)`,
      validate: (output) => output.includes('10') && output.includes('5'),
    },
    concepts: ['variables', 'assignment', 'updating values'],
    vizType: 'variables',
  },
  {
    id: 3,
    title: 'If / Else',
    subtitle: 'Make Decisions in Code',
    icon: '🔀',
    color: '#ec4899',
    xpReward: 200,
    badge: 'logic_lord',
    description: 'Make your code smart by choosing different paths based on conditions.',
    starterCode: `# If/else lets code make decisions
temperature = 35

if temperature > 30:
    print("It's hot! Drink water")
    status = "hot"
elif temperature > 20:
    print("Nice weather!")
    status = "warm"
else:
    print("It's cold. Wear a jacket!")
    status = "cold"

print(status)`,
    challenge: {
      title: 'Challenge: Grade Checker',
      description: 'Write code with a score variable. Print "Pass" if score >= 50, else print "Fail".',
      hint: 'Use an if/else statement to check the score',
      solution: `score = 75
if score >= 50:
    print("Pass")
else:
    print("Fail")`,
      validate: (output) => output.some(o => o === 'Pass' || o === 'Fail'),
    },
    concepts: ['if', 'elif', 'else', 'conditions'],
    vizType: 'ifelse',
  },
  {
    id: 4,
    title: 'For Loops',
    subtitle: 'Repeat Without Repeating',
    icon: '🔁',
    color: '#10b981',
    xpReward: 250,
    badge: 'loop_legend',
    description: 'Loops let you repeat actions automatically instead of writing the same code again and again.',
    starterCode: `# For loops repeat code automatically
total = 0

for i in range(5):
    print(i)
    total = total + i

print(total)

# Loop with a list
fruits = "apple"
for letter in range(3):
    print(letter)`,
    challenge: {
      title: 'Challenge: Countdown',
      description: 'Print numbers from 10 down to 1 using a loop (hint: range(10, 0, -1)).',
      hint: 'range(start, stop, step) — use a negative step to count down',
      solution: `for i in range(10, 0, -1):
    print(i)`,
      validate: (output) => output.length === 10 && output[0] === '10',
    },
    concepts: ['for loop', 'range()', 'iteration'],
    vizType: 'loop',
  },
  {
    id: 5,
    title: 'Nested Logic',
    subtitle: 'Loops + Conditions Together',
    icon: '⚡',
    color: '#f59e0b',
    xpReward: 300,
    badge: 'code_master',
    description: 'Combine loops and conditions to solve complex problems. This is where real programming begins!',
    starterCode: `# Combining loops and if/else
total = 0

for i in range(1, 11):
    if i % 2 == 0:
        print(i)
        total = total + i
    else:
        print("odd")

print(total)`,
    challenge: {
      title: 'Challenge: FizzBuzz',
      description: 'For numbers 1-10: print "Fizz" if divisible by 3, "Buzz" if by 5, else print the number.',
      hint: 'Use a for loop and if/elif/else inside it',
      solution: `for i in range(1, 11):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
      validate: (output) => output.includes('Fizz') && output.includes('Buzz'),
    },
    concepts: ['nested loops', 'if inside loops', 'modulo'],
    vizType: 'nested',
  },
];

export const useGameStore = create((set, get) => ({
  // XP & progression
  xp: 0,
  totalXp: 1000,
  level: 1,
  completedLevels: [],
  unlockedLevels: [1],
  badges: [],
  runCount: 0,

  // Current session
  currentLevel: null,
  showBadgeModal: false,
  lastBadge: null,
  showLevelComplete: false,
  challengeStartTime: null,

  // Actions
  setCurrentLevel: (levelId) => set({ currentLevel: levelId }),

  startChallenge: () => set({ challengeStartTime: Date.now() }),

  addXP: (amount) => {
    const { xp } = get();
    set({ xp: Math.min(xp + amount, 1000) });
  },

  earnBadge: (badgeId) => {
    const { badges } = get();
    if (!badges.includes(badgeId)) {
      const badge = BADGES[badgeId];
      set({
        badges: [...badges, badgeId],
        showBadgeModal: true,
        lastBadge: badge,
      });
      setTimeout(() => set({ showBadgeModal: false, lastBadge: null }), 4000);
    }
  },

  completeLevel: (levelId) => {
    const { completedLevels, unlockedLevels, runCount } = get();
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;

    const isNew = !completedLevels.includes(levelId);
    const newCompleted = isNew ? [...completedLevels, levelId] : completedLevels;
    const nextId = levelId + 1;
    const newUnlocked = unlockedLevels.includes(nextId) ? unlockedLevels : [...unlockedLevels, nextId];

    set({
      completedLevels: newCompleted,
      unlockedLevels: newUnlocked,
      showLevelComplete: true,
    });

    if (isNew) get().addXP(level.xpReward);
    if (isNew && level.badge) get().earnBadge(level.badge);
    if (runCount === 0) get().earnBadge('first_run');

    // Check if all levels done
    if (newCompleted.length === LEVELS.length) {
      setTimeout(() => get().earnBadge('code_master'), 2000);
    }
  },

  closeLevelComplete: () => set({ showLevelComplete: false }),

  incrementRunCount: () => {
    const { runCount } = get();
    if (runCount === 0) get().earnBadge('first_run');
    set({ runCount: runCount + 1 });
  },

  getBadgeInfo: (badgeId) => BADGES[badgeId],

  reset: () => set({
    xp: 0,
    completedLevels: [],
    unlockedLevels: [1],
    badges: [],
    runCount: 0,
    currentLevel: null,
  }),
}));
