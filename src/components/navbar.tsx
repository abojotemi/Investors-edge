"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { listItems, learnItems } from "@/lib/constants/navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    null
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const clubItems = [
    {
      title: "Getting Started",
      href: "#",
      icon: <CircleHelpIcon className="h-4 w-4" />,
    },
    {
      title: "Club Resources",
      href: "#",
      icon: <CircleIcon className="h-4 w-4" />,
    },
    {
      title: "Success Stories",
      href: "#",
      icon: <CircleCheckIcon className="h-4 w-4" />,
    },
  ];

  const aboutItems = [
    {
      title: "Our Mission",
      href: "#",
      icon: <CircleHelpIcon className="h-4 w-4" />,
    },
    { title: "Our Team", href: "#", icon: <CircleIcon className="h-4 w-4" /> },
    {
      title: "Contact Us",
      href: "#",
      icon: <CircleCheckIcon className="h-4 w-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu viewport={isMobile} className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold  transition-colors bg-transparent">
                  Membership
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-1 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2 rounded-lg">
                    {listItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                  Learn to Invest
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {learnItems.map((item) => (
                      <LearnItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </LearnItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent"
                  )}
                >
                  <Link href="/stocks">Find Stocks</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                  Investment Club
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-2 p-4">
                    <ClubItem
                      href="#"
                      icon={<CircleHelpIcon className="h-4 w-4" />}
                    >
                      Getting Started
                    </ClubItem>
                    <ClubItem
                      href="#"
                      icon={<CircleIcon className="h-4 w-4" />}
                    >
                      Club Resources
                    </ClubItem>
                    <ClubItem
                      href="#"
                      icon={<CircleCheckIcon className="h-4 w-4" />}
                    >
                      Success Stories
                    </ClubItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-2 p-4">
                    <ClubItem
                      href="#"
                      icon={<CircleHelpIcon className="h-4 w-4" />}
                    >
                      Our Mission & Method
                    </ClubItem>
                    <ClubItem
                      href="#"
                      icon={<CircleIcon className="h-4 w-4" />}
                    >
                      Our Team
                    </ClubItem>
                    <ClubItem
                      href="#"
                      icon={<CircleCheckIcon className="h-4 w-4" />}
                    >
                      Contact Us
                    </ClubItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-sm font-medium hover:text-primary-green"
            >
              Sign In
            </Button>
            <Button className="bg-primary-green hover:bg-primary-green/90 text-white text-sm font-medium px-6">
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-1">
              {/* Membership Section */}
              <MobileNavSection
                title="Membership"
                isExpanded={expandedSection === "membership"}
                onToggle={() => toggleSection("membership")}
              >
                {listItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary-green hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </MobileNavSection>

              {/* Learn to Invest Section */}
              <MobileNavSection
                title="Learn to Invest"
                isExpanded={expandedSection === "learn"}
                onToggle={() => toggleSection("learn")}
              >
                {learnItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary-green hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </MobileNavSection>

              {/* Find Stocks - Simple Link */}
              <Link
                href="/stocks"
                className="flex items-center justify-between text-sm font-semibold hover:text-primary-green transition-colors px-2 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Stocks
              </Link>

              {/* Investment Club Section */}
              <MobileNavSection
                title="Investment Club"
                isExpanded={expandedSection === "club"}
                onToggle={() => toggleSection("club")}
              >
                {clubItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary-green hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-primary-green">{item.icon}</span>
                    {item.title}
                  </Link>
                ))}
              </MobileNavSection>

              {/* About Us Section */}
              <MobileNavSection
                title="About Us"
                isExpanded={expandedSection === "about"}
                onToggle={() => toggleSection("about")}
              >
                {aboutItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary-green hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-primary-green">{item.icon}</span>
                    {item.title}
                  </Link>
                ))}
              </MobileNavSection>

              <div className="flex flex-col gap-2 pt-4 border-t border-border/40 mt-2">
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
                <Button className="w-full justify-center bg-primary-green hover:bg-primary-green/90 text-white">
                  Join Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
        >
          <div className="text-sm font-semibold leading-none text-primary-green mb-2">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function LearnItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
        >
          <div className="text-sm font-semibold leading-none text-primary-green mb-2">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function ClubItem({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex flex-row items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-primary-green"
        >
          <span className="text-primary-green">{icon}</span>
          <p>{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileNavSection({
  title,
  children,
  isExpanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold hover:text-primary-green transition-colors px-2 py-3"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-96 opacity-100 pb-2" : "max-h-0 opacity-0"
        )}
      >
        <div className="pl-2 space-y-1">{children}</div>
      </div>
    </div>
  );
}
