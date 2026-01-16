"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listItems,
  learnItems,
  investmentItems,
  communityItems,
  aboutItems as aboutNavItems,
} from "@/lib/constants/navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/auth-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    null
  );

  // Hide navbar on login page and admin routes
  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu viewport={isMobile} className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {/* Show these nav items only when logged in */}
              {user && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                      Learn to Invest
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-1">
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
                    <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                      Investments
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        {investmentItems.map((item) => (
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
                    <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                      Community
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
                        {communityItems.map((item) => (
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
                </>
              )}

              {/* About Us - Only show in center nav when logged in */}
              {user && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-semibold hover:text-primary-green transition-colors bg-transparent">
                    About Us
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
                      {aboutNavItems.map((item) => (
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
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full border-2 border-primary-green"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-green" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-sm font-medium hover:text-primary-green gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                {/* About Us dropdown for non-logged in users - positioned on the right */}
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      
                          <Link href="/about">
                            <Button
                            variant="ghost"
                            className="h-9 px-3 text-sm font-medium hover:text-primary-green transition-colors"
                            >
                            About Us
                            </Button>
                          </Link>

                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-primary-green"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-primary-green hover:bg-primary-green/90 text-white text-sm font-medium px-6">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
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
              {/* Show these sections only when logged in */}
              {user && (
                <>
                  {/* Membership Section */}
                  {/* <MobileNavSection
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
                  </MobileNavSection> */}

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

                  {/* Investments Section */}
                  <MobileNavSection
                    title="Investments"
                    isExpanded={expandedSection === "investments"}
                    onToggle={() => toggleSection("investments")}
                  >
                    {investmentItems.map((item) => (
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

                  {/* Community Section */}
                  <MobileNavSection
                    title="Community"
                    isExpanded={expandedSection === "community"}
                    onToggle={() => toggleSection("community")}
                  >
                    {communityItems.map((item) => (
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
                </>
              )}

              {/* About Us Section - Always visible */}
              <MobileNavSection
                title="About Us"
                isExpanded={expandedSection === "about"}
                onToggle={() => toggleSection("about")}
              >
                {aboutNavItems.map((item) => (
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

              <div className="flex flex-col gap-2 pt-4 border-t border-border/40 mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="w-10 h-10 rounded-full border-2 border-primary-green"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-green" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full justify-center bg-primary-green hover:bg-primary-green/90 text-white">
                        Join Now
                      </Button>
                    </Link>
                  </>
                )}
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
