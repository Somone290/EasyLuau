const BASE_LESSONS = [
  {
    title: "Hello, World!",
    tag: "Basics",
    body: `
      <p><strong>Luau</strong> is the scripting language of <strong>Roblox Studio</strong>. Let's start with the classic first program — just like you'll write inside a Script in Roblox.</p>
      <p>Use <code>print()</code> to write a message to the Roblox <strong>Output</strong> window (or here). Text goes between double or single quotes.</p>
      <pre><code>print("Hello, World!")
print('Luau is fun!')</code></pre>
      <p>Anything after two dashes <code>--</code> is a <strong>comment</strong> — Luau ignores it:</p>
      <pre><code>-- this line does nothing
print("But this one prints!")  -- comments can trail code</code></pre>
    `,
    example: `-- Your first Luau program
print("Hello, World!")
print("Learning Luau is easy!")
print("Let's go!")`,
    challenge: `Change the code so it prints exactly one line: <code>I love Luau</code>`,
    expected: ["I love Luau"]
  },
  {
    title: "Variables & Data Types",
    tag: "Variables",
    body: `
      <p>Variables store values. Use <code>local</code> to create one, and <code>=</code> to give it a value.</p>
      <pre><code>local name = "Ada"
local age = 36
local height = 1.65
local isCool = true</code></pre>
      <p>The main types are: <code>number</code>, <code>string</code>, <code>boolean</code>, <code>nil</code>, and <code>table</code>.</p>
      <ul>
        <li><code>nil</code> means "no value".</li>
        <li><code>false</code> is the other "off" value.</li>
        <li>Use <code>type()</code> to check a value's type.</li>
      </ul>
    `,
    example: `local name = "Ada"     -- string
local age = 36          -- number
local isCool = true     -- boolean
local nothing = nil     -- nil

print("My name is " .. name)
print("I am " .. age .. " years old")
print("Cool? " .. tostring(isCool))
print("type of name:", type(name))
print("type of age:", type(age))`,
    challenge: `Create a variable called <code>city</code> with the value <code>"Paris"</code>, then print it. Output should be exactly <code>Paris</code>.`,
    expected: ["Paris"]
  },
  {
    title: "Strings",
    tag: "Strings",
    body: `
      <p>Strings are text. Put them in quotes <code>"..."</code> or <code>'...'</code>.</p>
      <ul>
        <li>Join strings with <code>..</code> (concatenation).</li>
        <li>Get the length with <code>#</code>: <code>#"hello"</code> is <code>5</code>.</li>
        <li>Convert numbers to text with <code>tostring()</code>.</li>
      </ul>
      <p>Strings have handy methods you call with a colon:</p>
      <pre><code>local s = "Luau Rocks"
s:upper()   -- "LUAU ROCKS"
s:lower()   -- "luau rocks"
s:len()     -- 10
s:sub(1, 4) -- "Luau"</code></pre>
      <p><strong>Luau bonus:</strong> string interpolation! Put a value in <code>{}</code> inside backtick <code>\`...\`</code>:</p>
      <pre><code>local name = "Builder"
local coins = 50
print(\`Hello, {name}! You have {coins} coins.\`)</code></pre>
      <p>Long strings with line breaks use double brackets <code>[[ ... ]]</code>.</p>
    `,
    example: `local s = "Luau Rocks"

print(s:upper())
print(s:lower())
print(s:sub(1, 4))

print("Length: " .. #s)

-- Luau string interpolation
local name = "Builder"
local coins = 50
print(\`Hello, {name}! You have {coins} coins.\`)

local long = [[Line one
Line two
Line three]]
print(long)`,
    challenge: `Make a variable <code>word</code> = <code>"lua"</code> and print <code>word:upper()</code>. Output should be exactly <code>LUA</code>.`,
    expected: ["LUA"]
  },
  {
    title: "Numbers & Math",
    tag: "Numbers",
    body: `
      <p>Luau numbers can be integers or decimals. Use the normal math operators:</p>
      <pre><code>local a = 10
local b = 3

print(a + b)   -- 13
print(a - b)   -- 7
print(a * b)   -- 30
print(a / b)   -- 3.3333...
print(a % b)   -- 1  (remainder)
print(a ^ b)   -- 1000  (power)</code></pre>
      <p>The <code>math</code> library adds more:</p>
      <ul>
        <li><code>math.floor(x)</code> and <code>math.ceil(x)</code> round down/up.</li>
        <li><code>math.max(a, b, c)</code>, <code>math.min(...)</code>.</li>
        <li><code>math.random()</code> gives a random number 0–1.</li>
      </ul>
    `,
    example: `local x = 7
local y = 2

print("Sum:", x + y)
print("Product:", x * y)
print("Power:", x ^ y)

print("floor 3.7 =", math.floor(3.7))
print("ceil  3.2 =", math.ceil(3.2))
print("max:", math.max(4, 9, 2, 7))
print("random 1-10:", math.random(1, 10))`,
    challenge: `Print the result of <code>7 * 6</code> (store it in a variable first). Output should be exactly <code>42</code>.`,
    expected: ["42"]
  },
  {
    title: "Tables",
    tag: "Tables",
    body: `
      <p>Tables are Luau's one and only data structure. They can hold lists (arrays), dictionaries (key-value), or both!</p>
      <p>A <strong>list</strong> of values:</p>
      <pre><code>local fruits = {"apple", "banana", "cherry"}
print(fruits[1])   -- apple  (indexes start at 1!)</code></pre>
      <p>A <strong>dictionary</strong> with named keys:</p>
      <pre><code>local person = { name = "Ada", age = 36 }
print(person.name)  -- Ada
print(person.age)   -- 36</code></pre>
      <ul>
        <li>Add values with <code>table.insert(t, v)</code>.</li>
        <li>Count a list with <code>#t</code>.</li>
        <li>Loop a list with <code>ipairs</code>, a dictionary with <code>pairs</code>.</li>
      </ul>
      <p>Try changing the example!</p>
    `,
    example: `-- A list
local colors = {"red", "green", "blue"}
table.insert(colors, "purple")
print("colors count:", #colors)
print("last color:", colors[#colors])

-- A dictionary
local person = {
  name = "Ada",
  age = 36,
  city = "London"
}
print(person.name .. " is " .. person.age)
print(person.city)

-- Loop through a list
for i, color in ipairs(colors) do
  print(i .. ": " .. color)
end`,
    challenge: `Create a table <code>fruits</code> with three values: <code>"apple"</code>, <code>"banana"</code>, <code>"cherry"</code>. Print the <strong>second</strong> element. Output should be exactly <code>banana</code>.`,
    expected: ["banana"]
  },
  {
    title: "Conditions (if / else)",
    tag: "Control Flow",
    body: `
      <p>Make decisions with <code>if</code>, <code>elseif</code>, and <code>else</code>. Close the block with <code>end</code>.</p>
      <pre><code>local score = 85

if score >= 90 then
  print("Grade: A")
elseif score >= 75 then
  print("Grade: B")
else
  print("Keep practicing!")
end</code></pre>
      <p>Comparison operators: <code>==</code> equal, <code>~=</code> not equal, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>.</p>
      <p>Combine conditions with <code>and</code>, <code>or</code>, and negate with <code>not</code>:</p>
      <pre><code>if age &gt;= 13 and age &lt; 20 then
  print("Teenager")
end</code></pre>
    `,
    example: `local score = 78

if score >= 90 then
  print("Grade: A")
elseif score >= 75 then
  print("Grade: B")
elseif score >= 60 then
  print("Grade: C")
else
  print("Keep practicing!")
end

-- Logical operators
local age = 15
if age >= 13 and age < 20 then
  print("You are a teenager.")
end`,
    challenge: `Write an <code>if/elseif/else</code> chain for a <code>score</code> of <code>95</code> that prints <code>A</code>. Output should be exactly <code>A</code>.`,
    expected: ["A"]
  },
  {
    title: "Loops",
    tag: "Loops",
    body: `
      <p>Three ways to repeat code:</p>
      <p><strong>for</strong> — a known number of times:</p>
      <pre><code>for i = 1, 5 do
  print(i)
end</code></pre>
      <p><code>for i = start, stop, step</code>. Negative step counts down.</p>
      <p><strong>while</strong> — while a condition is true:</p>
      <pre><code>local n = 0
while n &lt; 3 do
  n = n + 1
  print("n = " .. n)
end</code></pre>
      <p><strong>repeat ... until</strong> — runs at least once.</p>
      <p>Use <code>break</code> to exit a loop early.</p>
      <p><strong>Luau bonus:</strong> <code>continue</code> skips the rest of this pass and jumps to the next iteration:</p>
      <pre><code>for i = 1, 5 do
  if i == 3 then continue end   -- skip 3
  print(i)
end</code></pre>
    `,
    example: `-- for loop: count to 5
for i = 1, 5 do
  print("Counting: " .. i)
end


-- count down by 2
for i = 10, 2, -2 do
  print(i)
end

-- while loop
local n = 0
while n < 3 do
  n = n + 1
  print("n is now " .. n)
end

-- break
for i = 1, 10 do
  if i == 4 then break end
  print("break at " .. i)
end

-- Luau 'continue' skips an iteration
for i = 1, 5 do
  if i == 3 then continue end
  print("skipping 3 -> " .. i)
end`,
    challenge: `Use a <code>for</code> loop to print <code>1</code>, <code>2</code>, <code>3</code> — each number on its own line.`,
    expected: ["1", "2", "3"]
  },
  {
    title: "Functions",
    tag: "Functions",
    body: `
      <p>Functions are reusable blocks of code. Define with <code>function ... end</code>.</p>
      <pre><code>local function greet(name)
  return "Hello, " .. name .. "!"
end

print(greet("Ada"))</code></pre>
      <ul>
        <li><code>return</code> sends back a value (or nothing).</li>
        <li>Functions can take multiple arguments.</li>
        <li>They can return multiple values!</li>
      </ul>
      <pre><code>local function add(a, b)
  return a + b
end

local function swap(a, b)
  return b, a   -- two return values
end

local x, y = swap("first", "second")</code></pre>
    `,
    example: `local function greet(name)
  return "Hello, " .. name .. "!"
end

print(greet("Ada"))
print(greet("World"))

local function add(a, b)
  return a + b
end

print("3 + 5 =", add(3, 5))

-- multiple return values
local function minmax(a, b, c)
  local min = math.min(a, b, c)
  local max = math.max(a, b, c)
  return min, max
end

local lo, hi = minmax(8, 3, 5)
print("min:", lo, "max:", hi)`,
    challenge: `Define a function <code>double(x)</code> that returns <code>x * 2</code>, then print <code>double(21)</code>. Output should be exactly <code>42</code>.`,
    expected: ["42"]
  },
  {
    title: "Scope & Locals",
    tag: "Scope",
    body: `
      <p>Variables declared with <code>local</code> only exist inside their block. This is called <strong>scope</strong>.</p>
      <pre><code>local x = 10

if x > 5 then
  local y = 99      -- only inside this if block
  print("y inside:", y)
end

print(y)            -- nil: the local y is out of scope here</code></pre>
      <p>Without <code>local</code>, a variable becomes <strong>global</strong> — visible everywhere. Globals live in the <code>_G</code> table.</p>
      <pre><code>secret = "hidden"   -- global (no 'local')
print(_G.secret)     -- "hidden"</code></pre>
      <p>Best practice: <strong>always use <code>local</code></strong> unless you truly need a global.</p>
    `,
    example: `local x = 10
print("x is", x)

if x > 5 then
  local y = 99
  print("y inside the block:", y)
end

-- The local y is gone here, so y is nil:
print("y outside the block:", y)

-- Without 'local' it becomes global
globalVar = "I am global"
print("From anywhere:", globalVar)
print("In _G table:", _G.globalVar)`,
    challenge: `Inside an <code>if</code> block, create a <strong>global</strong> variable <code>level</code> = <code>5</code> (no <code>local</code>!). After the block, print <code>level</code>. Output should be exactly <code>5</code>.`,
    expected: ["5"]
  },
  {
    title: "Mini Project: Number Guesser",
    tag: "Project",
    body: `
      <p>Time to combine everything! This is a working guessing game — but can you improve it?</p>
      <ul>
        <li>Change the range to <code>1, 100</code> so it's harder.</li>
        <li>Track how many guesses it took and print it at the end.</li>
        <li>Print a special message when the player runs out of guesses.</li>
        <li>Add more guesses to the list so the game always finishes.</li>
      </ul>
      <p><strong>Hint:</strong> the game uses <code>math.random(1, 10)</code>, <code>ipairs</code>, and <code>if/elseif/else</code>.</p>
    `,
    example: `local target = math.random(1, 10)

-- Pretend the player guesses these in order
local guesses = { 7, 3, 5, 9, 2 }

for i, guess in ipairs(guesses) do
  print("Guess #" .. i .. ": " .. guess)

  if guess == target then
    print("CORRECT! You got it!")
    break
  elseif guess < target then
    print("Too low!")
  else
    print("Too high!")
  end
end`,
    challenge: `Modify the game so it <strong>always</strong> prints <code>CORRECT!</code>: set the target to a fixed number and make sure one of the guesses matches it.`,
    contains: ["CORRECT!"]
  },
  {
    title: "Arithmetic",
    tag: "Numbers",
    body: `
      <p>Luau gives you the usual math operators, and they work on numbers:</p>
      <pre><code>print(10 + 3)   -- 13  addition
print(10 - 3)   -- 7   subtraction
print(10 * 3)   -- 30  multiplication
print(10 / 3)   -- 3.333...  division
print(10 % 3)   -- 1   remainder (modulo)
print(2 ^ 4)    -- 16  exponent (power of)</code></pre>
      <p>Use parentheses to control the order: <code>2 + 3 * 4</code> is <code>14</code>, but <code>(2 + 3) * 4</code> is <code>20</code>.</p>
      <p><code>%</code> (modulo) is handy for detecting even/odd numbers and wrapping values.</p>
    `,
    example: `print(7 + 3)
print(7 - 3)
print(7 * 3)
print(7 / 2)
print(7 % 3)
print(2 ^ 8)`,
    challenge: `Print the result of <code>(8 + 2) * 3</code>. Output should be exactly <code>30</code>.`,
    expected: ["30"]
  },
  {
    title: "Booleans & Logic",
    tag: "Operators",
    body: `
      <p>Comparisons produce a <code>boolean</code> — <code>true</code> or <code>false</code>:</p>
      <pre><code>print(5 == 5)   -- true   equal
print(5 ~= 5)   -- false  not equal
print(4 < 5)    -- true
print(5 <= 5)   -- true
print(6 > 10)   -- false</code></pre>
      <p>Combine conditions with logic operators:</p>
      <ul>
        <li><code>and</code> — true only if both sides are true.</li>
        <li><code>or</code> — true if either side is true.</li>
        <li><code>not</code> — flips true to false and back.</li>
      </ul>
      <pre><code>print(true and true)   -- true
print(true and false)  -- false
print(true or false)   -- true
print(not true)        -- false</code></pre>
      <p>In Luau only <code>nil</code> and <code>false</code> count as "falsy" — everything else (including <code>0</code> and empty strings) is truthy.</p>
    `,
    example: `local age = 17
print(age >= 16 and age < 18)
print(age == 18 or age < 18)
print(not (age < 16))`,
    challenge: `Print the result of <code>(5 &gt; 3) and not (2 == 3)</code>. Output should be exactly <code>true</code>.`,
    expected: ["true"]
  },
  {
    title: "while Loops",
    tag: "Loops",
    body: `
      <p>A <code>while</code> loop keeps running as long as its condition is true:</p>
      <pre><code>local n = 1
while n <= 3 do
  print("tick", n)
  n = n + 1
end</code></pre>
      <p>Two more ways to loop:</p>
      <ul>
        <li><code>break</code> — jumps out of a loop immediately.</li>
        <li><code>repeat ... until</code> — always runs at least once, then checks the condition at the end.</li>
      </ul>
      <p><strong>Careful:</strong> if a <code>while</code> condition never becomes false, the loop runs forever!</p>
    `,
    example: `local n = 3
while n >= 1 do
  print(n)
  n = n - 1
end
print("Liftoff!")`,
    challenge: `Use a <code>while</code> loop to print <code>3</code>, <code>2</code>, <code>1</code> — each number on its own line.`,
    expected: ["3", "2", "1"]
  },
  {
    title: "Table Methods",
    tag: "Tables",
    body: `
      <p>Tables are the Swiss Army knife of Luau. Build them and read them back:</p>
      <pre><code>local items = { "sword", "shield" }
table.insert(items, "potion")   -- adds to the end
table.remove(items, 2)          -- removes index 2
print(#items)                   -- 2 (length)</code></pre>
      <p><code>#</code> gives the number of items. Loop over every value with <code>ipairs</code>:</p>
      <pre><code>for i, item in ipairs(items) do
  print(i, item)
end</code></pre>
      <p>Remember — Luau starts counting at <code>1</code>, not <code>0</code>.</p>
    `,
    example: `local fruits = { "apple", "banana" }
table.insert(fruits, "cherry")
for i, fruit in ipairs(fruits) do
  print(i .. ": " .. fruit)
end
print("count:", #fruits)`,
    challenge: `Create an empty table, insert <code>"apple"</code>, <code>"banana"</code>, <code>"cherry"</code> with <code>table.insert</code>, then print its length with <code>#</code>. Output should be exactly <code>3</code>.`,
    expected: ["3"]
  },
  {
    title: "String Methods",
    tag: "Strings",
    body: `
      <p>Strings have built-in methods you call with a colon:</p>
      <pre><code>local s = "Roblox"
print(s:upper())   -- "ROBLOX"
print(s:lower())   -- "roblox"
print(s:len())     -- 6
print(s:sub(1, 3)) -- "Rob"</code></pre>
      <p><code>s:sub(start, finish)</code> cuts out a piece. Leave out <code>finish</code> to go to the end.</p>
      <p>Convert things back and forth:</p>
      <pre><code>print(tostring(42))            -- "42"
print(tonumber("3.14"))         -- 3.14
print(string.rep("ha", 3))      -- "hahaha"</code></pre>
    `,
    example: `local name = "Luau Quest"
print(name:upper())
print(name:lower())
print(name:sub(1, 4))
print(name:sub(6))
print(name:len())`,
    challenge: `Make <code>s</code> = <code>"Luau Quest"</code>. Print <code>s:sub(6)</code>. Output should be exactly <code>Quest</code>.`,
    expected: ["Quest"]
  },
  {
    title: "The math Library",
    tag: "Numbers",
    body: `
      <p>Roblox games live on math, and Luau ships a <code>math</code> library:</p>
      <pre><code>print(math.floor(2.7))  -- 2   rounds down
print(math.ceil(2.1))   -- 3   rounds up
print(math.round(2.5))  -- 3   rounds to nearest
print(math.abs(-9))     -- 9   drops the sign
print(math.max(3, 7, 2))-- 7   biggest
print(math.min(3, 7, 2))-- 2   smallest</code></pre>
      <p>And for randomness (drops, crits, spawns...):</p>
      <pre><code>print(math.random())        -- 0 to 1
print(math.random(1, 6))    -- 1, 2, 3, 4, 5, or 6
print(math.random(10))      -- 1 to 10</code></pre>
      <p><code>math.pi</code> is the circle constant, <code>3.14159...</code>.</p>
    `,
    example: `print(math.floor(3.99))
print(math.ceil(2.01))
print(math.abs(-42))
print(math.max(4, 9, 6))
print(math.round(math.pi))`,
    challenge: `Print <code>math.floor(math.pi)</code>. Output should be exactly <code>3</code>.`,
    expected: ["3"]
  },
  {
    title: "Multiple Returns",
    tag: "Functions",
    body: `
      <p>Luau functions can hand back more than one value:</p>
      <pre><code>local function minmax(a, b, c)
  return math.min(a, b, c), math.max(a, b, c)
end

local low, high = minmax(4, 9, 2)
print(low, high)  -- 2   9</code></pre>
      <p>The classic swap trick works too:</p>
      <pre><code>local function swap(a, b)
  return b, a
end
local x, y = swap("left", "right")</code></pre>
      <p>If a function returns nothing, you get <code>nil</code>.</p>
    `,
    example: `local function minmax(a, b, c)
  return math.min(a, b, c), math.max(a, b, c)
end
local low, high = minmax(4, 9, 2)
print("low:", low)
print("high:", high)`,
    challenge: `Write a function <code>bounds(n)</code> that returns <code>n - 1</code> and <code>n + 1</code>. With <code>n = 10</code>, print both on one line: <code>9 11</code>.`,
    expected: ["9 11"]
  },
  {
    title: "Type Annotations",
    tag: "Luau",
    body: `
      <p>Here's where Luau beats plain Lua: optional <strong>type annotations</strong>. Roblox Studio type-checks your scripts, so annotations catch mistakes early.</p>
      <pre><code>local health: number = 100
local name: string = "Ada"
local alive: boolean = true
local inventory: { string } = { "coin", "key" }</code></pre>
      <p>Annotate function parameters and returns too:</p>
      <pre><code>local function add(a: number, b: number): number
  return a + b
end</code></pre>
      <p>Annotations are hints to the analyzer — the code still runs the same way.</p>
    `,
    example: `local health: number = 100
local name: string = "Ada"
local inventory: { string } = { "coin", "key" }

local function add(a: number, b: number): number
  return a + b
end

print(name .. " has " .. health .. " HP")
print("Total items:", #inventory)
print("2 + 3 =", add(2, 3))`,
    challenge: `Declare <code>coins: number</code> = <code>100</code> and <code>name: string</code> = <code>"Ava"</code>, then print <code>Ava has 100 coins</code>.`,
    expected: ["Ava has 100 coins"]
  },
  {
    title: "Mini Project: FizzBuzz",
    tag: "Project",
    body: `
      <p>The most famous interview puzzle in programming. Print numbers <code>1</code> to <code>15</code>, but:</p>
      <ul>
        <li>Multiples of <code>3</code> print <code>Fizz</code>.</li>
        <li>Multiples of <code>5</code> print <code>Buzz</code>.</li>
        <li>Multiples of both print <code>FizzBuzz</code>.</li>
        <li>Everything else prints the number itself.</li>
      </ul>
      <p>You'll want <code>%</code> (modulo) to test divisibility and a <code>for</code> loop to visit each number. Build the string piece by piece with <code>..</code>.</p>
    `,
    example: `for i = 1, 15 do
  local line = ""

  if i % 3 == 0 then line = line .. "Fizz" end
  if i % 5 == 0 then line = line .. "Buzz" end

  if line == "" then
    print(i)
  else
    print(line)
  end
end`,
    challenge: `Print FizzBuzz for the numbers <code>1</code> to <code>5</code>. The output must be exactly the five lines below.`,
    expected: ["1", "2", "Fizz", "4", "Buzz"]
  }
];

let LESSONS = getEffectiveLessons();
window.BASE_LESSONS = BASE_LESSONS;

function getEffectiveLessons() {
  let v = null;
  try { v = JSON.parse(localStorage.getItem("admin_levels") || "null"); } catch (e) { v = null; }
  if (!v || typeof v !== "object") v = { overrides: {}, customs: [] };
  const list = BASE_LESSONS.map((l, i) => Object.assign({}, l, v.overrides && v.overrides[i]));
  (Array.isArray(v.customs) ? v.customs : []).forEach((c) => list.push(Object.assign({}, c)));
  return list;
}

window.addEventListener("lessons-changed", () => {
  LESSONS = getEffectiveLessons();
  updateProgressBar();
  renderList();
  if (current >= LESSONS.length) current = Math.max(0, LESSONS.length - 1);
  selectLesson(current);
});

function reportActivity(type, data) {
  if (window.FBApp && typeof window.FBApp.report === "function") window.FBApp.report(type, data);
}

const lessonList = document.getElementById("lesson-list");
const lessonBadge = document.getElementById("lesson-badge");
const lessonTitle = document.getElementById("lesson-title");
const lessonMeta = document.getElementById("lesson-meta");
const lessonStatus = document.getElementById("lesson-status");
const lessonBody = document.getElementById("lesson-body");
const code = document.getElementById("code");
const highlight = document.getElementById("highlight");
const gutter = document.getElementById("gutter");
const output = document.getElementById("output");
const banner = document.getElementById("banner");
const runBtn = document.getElementById("run-btn");
const resetBtn = document.getElementById("reset-btn");
const resetProgressBtn = document.getElementById("reset-progress");
const progressLabel = document.getElementById("progress-label");
const progressPct = document.getElementById("progress-pct");
const progressFill = document.getElementById("progress-fill");
const completeOverlay = document.getElementById("complete-overlay");
const completeTitle = document.getElementById("complete-title");
const completeSub = document.getElementById("complete-sub");
const completeContinue = document.getElementById("complete-continue");
const hintBox = document.getElementById("hint-box");
const hintText = document.getElementById("hint-text");

let current = 0;
let failures = 0;
let completed = [];
try {
  completed = JSON.parse(localStorage.getItem("learnlua_progress") || "[]");
  if (!Array.isArray(completed)) completed = [];
} catch (e) {
  completed = [];
}

function isCompleted(idx) { return completed.indexOf(idx) !== -1; }
function isUnlocked(idx) { return idx === 0 || isCompleted(idx - 1); }

function saveProgress() {
  localStorage.setItem("learnlua_progress", JSON.stringify(completed));
}

function updateProgressBar() {
  const pct = Math.round((completed.length / LESSONS.length) * 100);
  progressLabel.textContent = completed.length + " / " + LESSONS.length;
  progressPct.textContent = pct + "%";
  progressFill.style.width = pct + "%";
}

function updateGutter() {
  const lines = code.value.split("\n").length;
  let html = "";
  for (let i = 1; i <= lines; i++) html += "<span>" + i + "</span>";
  gutter.innerHTML = html;
  syncGutterScroll();
}
function syncGutterScroll() {
  gutter.style.transform = "translateY(" + (-code.scrollTop) + "px)";
}

function showBanner(msg, type) {
  banner.hidden = false;
  banner.className = type;
  banner.textContent = msg;
  banner.scrollIntoView({ block: "nearest" });
}
function hideBanner() { banner.hidden = true; }

const KEYWORDS = new Set([
  "and", "break", "continue", "do", "else", "elseif", "end", "for", "function",
  "goto", "if", "in", "local", "not", "or", "repeat", "return",
  "then", "until", "while"
]);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightLua(src) {
  let html = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === "-" && src[i + 1] === "-") {
      const end = src.indexOf("\n", i);
      const seg = end === -1 ? src.slice(i) : src.slice(i, end);
      html += '<span class="c">' + esc(seg) + "</span>";
      i += seg.length;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") j += 2;
        else if (src[j] === ch) { j++; break; }
        else j++;
      }
      html += '<span class="s">' + esc(src.slice(i, j)) + "</span>";
      i = j;
    } else if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (KEYWORDS.has(word)) html += '<span class="k">' + word + "</span>";
      else if (word === "true" || word === "false" || word === "nil") {
        html += '<span class="b">' + word + "</span>";
      } else {
        html += esc(word);
      }
      i = j;
    } else if (/\d/.test(ch)) {
      let j = i;
      while (j < n && /[0-9a-fA-FxX.eE+-]/.test(src[j])) j++;
      html += '<span class="n">' + esc(src.slice(i, j)) + "</span>";
      i = j;
    } else {
      html += esc(ch);
      i++;
    }
  }
  return html;
}

function renderList() {
  lessonList.innerHTML = "";
  LESSONS.forEach((lesson, idx) => {
    const btn = document.createElement("button");
    let tag = "";
    if (isCompleted(idx)) {
      btn.classList.add("completed");
      tag = '<span class="tag done">Done</span>';
    } else if (!isUnlocked(idx)) {
      btn.classList.add("locked");
      tag = '<span class="tag locked">Locked</span>';
    }
    btn.innerHTML = '<span class="num">' + (idx + 1) + "</span>" +
      '<span class="title">' + lesson.title + "</span>" + tag;
    btn.addEventListener("click", () => selectLesson(idx));
    if (idx === current) btn.classList.add("active");
    lessonList.appendChild(btn);
  });
}

function selectLesson(idx) {
  if (!isUnlocked(idx)) {
    showBanner("Complete lesson " + idx + " first to unlock this one.", "locked");
    return;
  }
  hideBanner();
  failures = 0;
  showHint(null);
  current = idx;
  renderList();
  const lesson = LESSONS[idx];
  lessonBadge.textContent = String(idx + 1).padStart(2, "0");
  lessonTitle.textContent = lesson.title;
  lessonMeta.textContent = "Level " + (idx + 1) + " of " + LESSONS.length + " \u00b7 " + lesson.tag;
  lessonStatus.textContent = isCompleted(idx) ? "Completed" : "In progress";
  lessonStatus.className = "status-tag " + (isCompleted(idx) ? "done" : "todo");
  lessonBody.innerHTML = lesson.body +
    '<div class="challenge"><h3>Challenge</h3><p>' + lesson.challenge + "</p>" +
    (isCompleted(idx) ? '<p class="done">Already completed.</p>' : "") + "</div>";
  code.value = lesson.example;
  syncHighlight();
  updateGutter();
  output.textContent = "";
  code.focus();
  reportActivity("view", { lesson: idx + 1 });
}

function runCode() {
  output.innerHTML = "";
  if (!luauReady) {
    showBanner("Loading the Luau engine, one moment...", "locked");
    return;
  }
  const src = code.value;
  let lines;
  try {
    lines = execute(src);
  } catch (err) {
    const msg = String(err.message || err).replace(/^[^:]+:\d+:\s*/, "");
    const div = document.createElement("div");
    div.className = "err";
    div.textContent = msg;
    output.appendChild(div);
    registerFailure(src, "", msg);
    return;
  }
  if (lines.length === 0) {
    output.innerHTML = '<span class="ok">(no output)</span>';
  } else {
    lines.forEach((line) => {
      const div = document.createElement("div");
      div.textContent = line;
      output.appendChild(div);
    });
  }
  const lesson = LESSONS[current];
  if (!lesson.expected && !lesson.contains) return;
  const out = lines.join("\n");
  let pass;
  if (lesson.expected) {
    pass = out === lesson.expected.join("\n");
  } else {
    pass = lesson.contains.every((s) => out.indexOf(s) !== -1);
  }

  if (pass) {
    failures = 0;
    showHint(null);
    const isNew = !isCompleted(current);
    if (isNew) {
      completed.push(current);
      completed.sort((a, b) => a - b);
      saveProgress();
      updateProgressBar();
      reportActivity("complete", { lesson: current + 1, extra: "progress:" + completed.length + "/" + LESSONS.length });
    }
    renderList();
    if (isNew) {
      showCompletionModal();
    } else {
      showBanner("Level " + (current + 1) + " was already completed.", "success");
    }
  } else {
    registerFailure(src, out);
    reportActivity("fail", { lesson: current + 1 });
    let msg = "Not quite right. Expected:\n" + lesson.expected.join("\n") +
      "\n\nYour output:\n" + (out || "(nothing)");
    showBanner(msg, "fail");
  }
}

function registerFailure(src, out, err) {
  failures++;
  if (failures >= 5) {
    showHint(buildHint(src, out, err));
  } else {
    showHint(null);
  }
}

function showHint(text) {
  if (!text) {
    hintBox.hidden = true;
    return;
  }
  hintText.textContent = text;
  hintBox.hidden = false;
}

function buildHint(src, out, err) {
  const lesson = LESSONS[current];
  const hints = [];
  if (err) hints.push("Your code has an error: " + err);
  if (!src.trim()) hints.push("The editor is empty — paste the example back in and edit it.");
  else if (!/print\s*\(/.test(src)) hints.push("I don't see print(...) in your code. Output only shows up when you call print.");
  switch (current) {
    case 0:
      if (src.indexOf('"I love Luau"') === -1) hints.push("The exact string \"I love Luau\" isn't in your code — capital I, exact spelling, no extra words.");
      break;
    case 1:
      if (!/\bcity\b/.test(src)) hints.push("Create a variable named city.");
      if (src.indexOf('"Paris"') === -1) hints.push("Give city the value \"Paris\" — with quotes, capital P.");
      break;
    case 2:
      if (!/\bword\b/.test(src)) hints.push("Create a variable word = \"lua\".");
      if (!/\.upper\s*\(/.test(src)) hints.push("Call word:upper() to get the uppercase version.");
      break;
    case 3:
      if (src.indexOf("*") === -1) hints.push("Multiply with the * operator: 7 * 6.");
      break;
    case 4:
      if (!/\bfruits\b/.test(src)) hints.push("Create a table named fruits with three values.");
      if (!/fruits\s*\[/.test(src)) hints.push("Read the second element as fruits[2] — Luau lists start at index 1, not 0.");
      break;
    case 5:
      if (!/\bscore\b/.test(src)) hints.push("Start with local score = 95.");
      if (!/\bif\b/.test(src)) hints.push("Branch with if / elseif / else on the score.");
      if (src.indexOf("A") === -1) hints.push("The top branch should print \"A\" for a score of 95.");
      break;
    case 6:
      if (!/\bfor\b/.test(src)) hints.push("Use a for loop: for i = 1, 3 do ... end.");
      break;
    case 7:
      if (!/\bdouble\b/.test(src)) hints.push("Define a function named double(x).");
      if (!/\breturn\b/.test(src)) hints.push("Inside the function, return x * 2.");
      break;
    case 8:
      if (/\blocal\s+level\b/.test(src)) hints.push("Remove local from level — a local would vanish when the block ends. Without it, level is global and survives.");
      if (!/\bif\b/.test(src)) hints.push("Put the assignment inside an if block (that's the trick of this lesson).");
      break;
    case 9:
      if (src.indexOf("CORRECT!") === -1) hints.push("Nothing you print contains CORRECT!. Set a fixed target and make one guess always equal it.");
      break;
    case 10:
      if (!/\*/.test(src)) hints.push("Multiply with the * operator: 8 + 2 first, then times 3.");
      if (!/\(/.test(src)) hints.push("Parentheses control the order — (8 + 2) * 3 runs the addition before the multiplication.");
      break;
    case 11:
      if (src.indexOf("and") === -1 || src.indexOf("not") === -1) hints.push("Combine (5 > 3) with and not to flip the second comparison.");
      break;
    case 12:
      if (!/\bwhile\b/.test(src)) hints.push("Use a while loop and count n down from 3.");
      if (!/n\s*=\s*n\s*-\s*1/.test(src)) hints.push("Decrement n inside the loop (n = n - 1) or it will run forever.");
      break;
    case 13:
      if (!/\btable\.insert\b/.test(src)) hints.push("Build the table by inserting with table.insert.");
      if (src.indexOf("#") === -1) hints.push("Print the length with #t.");
      break;
    case 14:
      if (!/\bs\s*=/.test(src)) hints.push("Create a variable s = \"Luau Quest\".");
      if (!/\.sub\s*\(/.test(src)) hints.push("Cut a piece with s:sub(6) — index 6 is the Q in Quest.");
      break;
    case 15:
      if (!/\bmath\.floor\b/.test(src)) hints.push("math.floor() rounds a number down.");
      if (src.indexOf("math.pi") === -1) hints.push("math.pi is 3.14159... — floor it.");
      break;
    case 16:
      if (!/\bbounds\b/.test(src)) hints.push("Define a function named bounds(n).");
      if (!/\breturn\b/.test(src)) hints.push("return n - 1, n + 1 hands back both values.");
      break;
    case 17:
      if (!/\bcoins\b/.test(src) || !/\bname\b/.test(src)) hints.push("Declare coins: number = 100 and name: string = \"Ava\".");
      if (!/:\s*(number|string)\b/.test(src)) hints.push("Use type annotations like coins: number = 100.");
      break;
    case 18:
      if (!/\bfor\b/.test(src)) hints.push("Loop from 1 to 5 with a for loop.");
      if (src.indexOf("%") === -1) hints.push("Use % (modulo) to test divisibility: i % 3 == 0.");
      break;
  }
  if (lesson.expected && out) {
    const exp = lesson.expected.join("\n").split("\n");
    const got = out.split("\n");
    for (let i = 0; i < Math.max(exp.length, got.length); i++) {
      if (exp[i] !== got[i]) {
        hints.push("Output line " + (i + 1) + " says \"" + (got[i] || "(nothing)") + "\" but the challenge wants \"" + exp[i] + "\".");
        break;
      }
    }
  }
  if (!hints.length) hints.push("Compare your code to the example above — check types, spelling, and what the challenge asks for.");
  return hints.join("\n");
}

let executeScript = null;
let luauReady = false;

function showCompletionModal() {
  completeTitle.textContent = "YOU COMPLETED LEVEL " + (current + 1);
  completeSub.textContent = completed.length === LESSONS.length
    ? "That was the last level. You're a Luau master now!"
    : "Level " + (current + 2) + " is now unlocked.";
  completeOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCompletionModal(advance) {
  completeOverlay.hidden = true;
  document.body.style.overflow = "";
  if (advance && current + 1 < LESSONS.length) {
    selectLesson(current + 1);
  } else {
    code.focus();
  }
}

function execute(src) {
  if (!executeScript) throw new Error("The Luau engine is still loading, try again in a moment.");
  const result = executeScript(src);
  if (result && result.startsWith("ERROR:")) {
    throw new Error(result.substring(6));
  }
  const trimmed = (result || "").trim();
  return trimmed ? trimmed.split("\n") : [];
}

async function initLuau() {
  try {
    const binary = Uint8Array.from(atob(LUAU_WASM_B64), (c) => c.charCodeAt(0));
    const module = await createLuau({ wasmBinary: binary });
    executeScript = module.cwrap("executeScript", "string", ["string"]);
    luauReady = true;
    runBtn.disabled = false;
  } catch (err) {
    showBanner("Failed to load the Luau engine: " + err.message, "fail");
  }
}

function syncHighlight() {
  highlight.innerHTML = highlightLua(code.value);
  highlight.scrollTop = code.scrollTop;
  highlight.scrollLeft = code.scrollLeft;
}

code.addEventListener("input", () => { syncHighlight(); updateGutter(); });
code.addEventListener("scroll", () => {
  highlight.scrollTop = code.scrollTop;
  highlight.scrollLeft = code.scrollLeft;
  syncGutterScroll();
});
code.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = code.selectionStart;
    const end = code.selectionEnd;
    code.value = code.value.slice(0, start) + "  " + code.value.slice(end);
    code.selectionStart = code.selectionEnd = start + 2;
    syncHighlight();
    updateGutter();
  }
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    runCode();
  }
});

runBtn.addEventListener("click", runCode);
resetBtn.addEventListener("click", () => {
  code.value = LESSONS[current].example;
  syncHighlight();
  output.textContent = "";
  code.focus();
});
resetProgressBtn.addEventListener("click", () => {
  if (confirm("Reset all progress? This will lock every lesson.")) {
    completed = [];
    saveProgress();
    updateProgressBar();
    renderList();
    selectLesson(0);
  }
});
completeContinue.addEventListener("click", () => closeCompletionModal(true));
completeOverlay.addEventListener("click", (e) => {
  if (e.target === completeOverlay) closeCompletionModal(true);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !completeOverlay.hidden) closeCompletionModal(true);
});

runBtn.disabled = true;
updateProgressBar();
renderList();
selectLesson(0);
initLuau();


