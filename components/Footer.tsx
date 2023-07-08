import { Github, Linkedin, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full text-gray-600">
      <div className="flex flex-col flex-wrap px-5 py-12 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap">
        <div className="flex-shrink-0 w-64 mx-auto mt-10 text-center md:mx-0 md:text-left md:mt-0">
          <a className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start">
            <UtensilsCrossed className="w-20 h-20" />
            <span className="ml-3 text-xl">Medina Family Recipes</span>
          </a>
        </div>
        <div className="flex flex-wrap flex-grow order-first -mb-10 text-center md:pr-20 md:text-left">
          <div className="w-full px-4 lg:w-1/4 md:w-1/2">
            <nav className="flex flex-col mb-10">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                Home
              </Link>
              <Link
                href="/recipes"
                className="text-gray-600 hover:text-gray-800"
              >
                Recipes
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container flex flex-col flex-wrap px-5 py-4 mx-auto sm:flex-row">
          <p className="text-sm text-center text-gray-500 sm:text-left">
            © Medina Family —
            <a
              href="https://jccdev.tech"
              rel="noopener noreferrer"
              className="ml-1 text-gray-600"
              target="_blank"
            >
              @jccdev
            </a>
          </p>
          <span className="inline-flex justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start">
            <Link
              className="text-gray-500"
              href="https://www.github.com/jccdev45"
              target="_blank"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              className="text-gray-500"
              href="https://www.linkedin.com/in/jordan-cruz-correa"
              target="_blank"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
