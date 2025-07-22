import { NextResponse } from 'next/server';

const programmingQuotes = [
  {
    id: 1,
    quote: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie",
    category: "learning"
  },
  {
    id: 2,
    quote: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "clean-code"
  },
  {
    id: 3,
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "problem-solving"
  },
  {
    id: 4,
    quote: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine",
    category: "mindset"
  },
  {
    id: 5,
    quote: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    category: "debugging"
  },
  {
    id: 6,
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "clean-code"
  },
  {
    id: 7,
    quote: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde",
    category: "learning"
  },
  {
    id: 8,
    quote: "The most important property of a program is whether it accomplishes the intention of its user.",
    author: "C.A.R. Hoare",
    category: "purpose"
  },
  {
    id: 9,
    quote: "Programming is not about typing, it's about thinking.",
    author: "Rich Hickey",
    category: "mindset"
  },
  {
    id: 10,
    quote: "The computer was born to solve problems that did not exist before.",
    author: "Bill Gates",
    category: "innovation"
  },
  {
    id: 11,
    quote: "It's not a bug; it's an undocumented feature.",
    author: "Anonymous",
    category: "humor"
  },
  {
    id: 12,
    quote: "Debugging is twice as hard as writing the code in the first place.",
    author: "Brian Kernighan",
    category: "debugging"
  },
  {
    id: 13,
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "action"
  },
  {
    id: 14,
    quote: "The function of good software is to make the complex appear to be simple.",
    author: "Grady Booch",
    category: "design"
  },
  {
    id: 15,
    quote: "Code never lies, comments sometimes do.",
    author: "Ron Jeffries",
    category: "truth"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const random = searchParams.get('random');

    let filteredQuotes = programmingQuotes;

    // Filter by category if provided
    if (category) {
      filteredQuotes = programmingQuotes.filter(
        quote => quote.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Return random quote if requested
    if (random === 'true') {
      const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
      return NextResponse.json({
        success: true,
        data: randomQuote,
        message: 'Random quote retrieved successfully'
      });
    }

    // Return all quotes (or filtered by category)
    return NextResponse.json({
      success: true,
      data: filteredQuotes,
      total: filteredQuotes.length,
      categories: [...new Set(programmingQuotes.map(q => q.category))],
      message: 'Quotes retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve quotes' },
      { status: 500 }
    );
  }
}
