"use client";

import { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  CalendarDays,
  BedDouble,
  Users,
  CreditCard,
  UtensilsCrossed,
  Package,
  Settings,
  BarChart3,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Mail,
  ExternalLink,
  HelpCircle,
  FileText,
  ShieldCheck,
  DoorOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";

type HelpArticle = {
  id: string;
  title: string;
  description: string;
  category: string;
  popular?: boolean;
};

type HelpCategory = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  articles: HelpArticle[];
};

const categories: HelpCategory[] = [
  {
    title: "Reservations",
    description: "Create, modify, cancel and manage guest reservations.",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
    articles: [
      {
        id: "create-reservation",
        title: "How to create a reservation",
        description: "Learn how to create a new reservation for a guest.",
        category: "Reservations",
        popular: true,
      },
      {
        id: "modify-reservation",
        title: "Modify a reservation",
        description: "Change dates, guests, room or rate information.",
        category: "Reservations",
      },
      {
        id: "cancel-reservation",
        title: "Cancel a reservation",
        description: "Understand cancellation rules and refund handling.",
        category: "Reservations",
      },
      {
        id: "change-room",
        title: "Change a guest's room",
        description: "Move a reservation to another available room.",
        category: "Reservations",
      },
      {
        id: "no-show",
        title: "Handling no-shows",
        description:
          "Learn how to mark and process a reservation as a no-show.",
        category: "Reservations",
      },
    ],
  },

  {
    title: "Front Desk",
    description: "Manage check-ins, check-outs, rooms and daily operations.",
    icon: DoorOpen,
    color: "bg-purple-50 text-purple-600",
    articles: [
      {
        id: "check-in",
        title: "Checking in a guest",
        description: "Complete the guest arrival and room assignment process.",
        category: "Front Desk",
        popular: true,
      },
      {
        id: "check-out",
        title: "Checking out a guest",
        description: "Complete checkout, payment and room departure.",
        category: "Front Desk",
        popular: true,
      },
      {
        id: "room-status",
        title: "Managing room status",
        description:
          "Understand clean, dirty, inspected and out-of-order rooms.",
        category: "Front Desk",
      },
      {
        id: "front-desk-calendar",
        title: "Using the front desk calendar",
        description: "Manage reservations visually using the room calendar.",
        category: "Front Desk",
      },
    ],
  },

  {
    title: "Rooms & Inventory",
    description: "Configure rooms, room types, rates and availability.",
    icon: BedDouble,
    color: "bg-green-50 text-green-600",
    articles: [
      {
        id: "create-room",
        title: "Adding a new room",
        description: "Create rooms and assign them to room types.",
        category: "Rooms & Inventory",
      },
      {
        id: "room-types",
        title: "Understanding room types",
        description: "Learn how room types and physical rooms work together.",
        category: "Rooms & Inventory",
      },
      {
        id: "rate-plans",
        title: "Managing rate plans",
        description:
          "Configure flexible, non-refundable and other pricing plans.",
        category: "Rooms & Inventory",
      },
      {
        id: "room-rates",
        title: "Understanding room rates",
        description:
          "Learn how rates are calculated and attached to reservations.",
        category: "Rooms & Inventory",
        popular: true,
      },
      {
        id: "availability",
        title: "Managing room availability",
        description: "Monitor available, occupied and unavailable rooms.",
        category: "Rooms & Inventory",
      },
    ],
  },

  {
    title: "Guests",
    description: "Manage guest profiles, stays and guest information.",
    icon: Users,
    color: "bg-orange-50 text-orange-600",
    articles: [
      {
        id: "guest-profile",
        title: "Managing guest profiles",
        description: "Create and update guest information.",
        category: "Guests",
      },
      {
        id: "guest-history",
        title: "Viewing guest history",
        description: "See previous reservations and guest activity.",
        category: "Guests",
      },
      {
        id: "guest-documents",
        title: "Managing guest documents",
        description: "Store and manage identification documents.",
        category: "Guests",
      },
    ],
  },

  {
    title: "Billing & Payments",
    description: "Manage folios, charges, invoices, payments and refunds.",
    icon: CreditCard,
    color: "bg-yellow-50 text-yellow-700",
    articles: [
      {
        id: "folios",
        title: "Understanding guest folios",
        description: "Learn how charges and payments are tracked.",
        category: "Billing & Payments",
        popular: true,
      },
      {
        id: "post-charge",
        title: "Posting a charge",
        description:
          "Add room, restaurant, laundry and other charges to a folio.",
        category: "Billing & Payments",
      },
      {
        id: "payments",
        title: "Recording a payment",
        description: "Record cash, card, transfer and other payments.",
        category: "Billing & Payments",
      },
      {
        id: "refunds",
        title: "Processing refunds",
        description: "Understand when and how payments should be refunded.",
        category: "Billing & Payments",
      },
      {
        id: "invoices",
        title: "Creating guest invoices",
        description: "Generate invoices for completed stays and services.",
        category: "Billing & Payments",
        popular: true,
      },
    ],
  },

  {
    title: "Restaurant & POS",
    description: "Manage restaurant orders and guest food charges.",
    icon: UtensilsCrossed,
    color: "bg-red-50 text-red-600",
    articles: [
      {
        id: "restaurant-order",
        title: "Creating a restaurant order",
        description: "Create and manage restaurant orders.",
        category: "Restaurant & POS",
      },
      {
        id: "charge-to-folio",
        title: "Charging an order to a guest folio",
        description: "Post restaurant charges directly to a guest stay.",
        category: "Restaurant & POS",
        popular: true,
      },
      {
        id: "direct-payment",
        title: "Handling direct restaurant payments",
        description: "Accept payment directly without posting to a folio.",
        category: "Restaurant & POS",
      },
      {
        id: "restaurant-refund",
        title: "Refunding restaurant orders",
        description: "Process refunds for restaurant transactions.",
        category: "Restaurant & POS",
      },
    ],
  },

  {
    title: "Services",
    description: "Manage additional hotel services and guest requests.",
    icon: Package,
    color: "bg-pink-50 text-pink-600",
    articles: [
      {
        id: "laundry",
        title: "Managing laundry orders",
        description: "Create laundry orders and charge guests.",
        category: "Services",
      },
      {
        id: "gym",
        title: "Managing gym memberships",
        description: "Manage hotel gym access and memberships.",
        category: "Services",
      },
      {
        id: "service-charges",
        title: "Posting service charges",
        description: "Add hotel services to a guest folio.",
        category: "Services",
      },
    ],
  },

  {
    title: "Reports",
    description: "Understand revenue, occupancy and hotel performance.",
    icon: BarChart3,
    color: "bg-indigo-50 text-indigo-600",
    articles: [
      {
        id: "occupancy-report",
        title: "Occupancy reports",
        description: "Understand your hotel's occupancy performance.",
        category: "Reports",
      },
      {
        id: "revenue-report",
        title: "Revenue reports",
        description: "Review revenue generated across your property.",
        category: "Reports",
      },
      {
        id: "payment-report",
        title: "Payment reports",
        description: "Review payments and payment methods.",
        category: "Reports",
      },
      {
        id: "financial-report",
        title: "Financial reports",
        description: "Understand financial activity across the PMS.",
        category: "Reports",
      },
    ],
  },

  {
    title: "Settings",
    description: "Configure your property and PMS preferences.",
    icon: Settings,
    color: "bg-gray-100 text-gray-700",
    articles: [
      {
        id: "property-settings",
        title: "Property settings",
        description: "Configure your hotel's basic information.",
        category: "Settings",
      },
      {
        id: "users-permissions",
        title: "Users and permissions",
        description: "Manage staff accounts and access permissions.",
        category: "Settings",
      },
      {
        id: "taxes",
        title: "Managing taxes",
        description: "Configure taxes applied to rooms and services.",
        category: "Settings",
      },
      {
        id: "payment-methods",
        title: "Payment methods",
        description: "Configure available payment methods.",
        category: "Settings",
      },
    ],
  },
];

const faqs = [
  {
    question: "How do I create a reservation?",
    answer:
      "Go to Reservations and select New Reservation. Select the guest, stay dates, room type, room, rate plan and payment information, then confirm the reservation.",
  },
  {
    question: "Can I change the room after a guest has checked in?",
    answer:
      "Yes. Open the reservation, select Change Room and choose an available room. The PMS should preserve the existing stay and update the room assignment.",
  },
  {
    question: "Where are guest charges stored?",
    answer:
      "Guest financial activity is recorded on the guest's folio. Room charges, restaurant charges, services, payments and adjustments can be tracked there.",
  },
  {
    question: "Can a restaurant guest pay directly?",
    answer:
      "Yes. Restaurant orders can either be paid directly using a payment method or posted to an in-house guest's folio for payment during checkout.",
  },
  {
    question: "What happens when a reservation is cancelled?",
    answer:
      "Cancellation should preserve the reservation history while changing its status to cancelled. Any applicable cancellation fee or refund should be recorded separately.",
  },
  {
    question: "How do I check a guest out?",
    answer:
      "Open the guest's reservation, review the folio, settle any outstanding balance, generate the invoice if required and complete checkout.",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const allArticles = useMemo(
    () => categories.flatMap((category) => category.articles),
    [],
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query),
    );
  }, [search, allArticles]);

  const visibleCategories = activeCategory
    ? categories.filter((category) => category.title === activeCategory)
    : categories;

  const popularArticles = allArticles.filter((article) => article.popular);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HelpCircle className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How can we help?
            </h1>

            <p className="mt-3 text-muted-foreground">
              Find answers, learn how to use the PMS and get help managing your
              property.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for articles, features or questions..."
                className="h-14 w-full rounded-xl border bg-background pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {search && (
              <div className="mx-auto mt-3 max-w-2xl rounded-xl border bg-background p-2 text-left shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map((article) => (
                    <button
                      key={article.id}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {article.category}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))
                ) : (
                  <div className="p-5 text-center">
                    <p className="font-medium">No articles found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try searching with a different keyword.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Category filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted",
            )}
          >
            All topics
          </button>

          {categories.map((category) => (
            <button
              key={category.title}
              onClick={() => setActiveCategory(category.title)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                activeCategory === category.title
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              )}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Categories */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Browse by topic</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find help for the area of the PMS you are working with.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.title}
                  className="group rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-lg",
                        category.color,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {category.articles.length} articles
                    </span>
                  </div>

                  <h3 className="mt-5 font-semibold">{category.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="mt-5 space-y-1">
                    {category.articles.slice(0, 3).map((article) => (
                      <button
                        key={article.id}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      >
                        <span>{article.title}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </div>

                  {category.articles.length > 3 && (
                    <button className="mt-3 flex items-center gap-1 px-2 text-sm font-medium text-primary">
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular articles */}
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">Popular articles</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Answers to some of the most common PMS questions.
              </p>
            </div>

            <button className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex">
              View all articles
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {popularArticles.map((article) => (
              <button
                key={article.id}
                className="flex items-center gap-4 rounded-xl border bg-background p-4 text-left transition hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium">{article.title}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {article.description}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Quick guides */}
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Quick guides</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Step-by-step guides for common hotel operations.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <QuickGuide
              icon={CalendarDays}
              title="Manage a reservation"
              description="Create a reservation, assign a room and manage the guest's stay."
              steps={[
                "Create reservation",
                "Assign room",
                "Confirm rate",
                "Check in guest",
              ]}
            />

            <QuickGuide
              icon={CreditCard}
              title="Complete a checkout"
              description="Settle the guest folio and complete the checkout process."
              steps={[
                "Review folio",
                "Post outstanding charges",
                "Collect payment",
                "Generate invoice",
              ]}
            />

            <QuickGuide
              icon={BarChart3}
              title="Understand hotel performance"
              description="Use PMS reports to understand occupancy and revenue."
              steps={[
                "Open Reports",
                "Select date range",
                "Review occupancy",
                "Review revenue",
              ]}
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold">
                Frequently asked questions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Quick answers to common questions about the PMS.
              </p>
            </div>

            <div className="divide-y rounded-xl border bg-background">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={faq.question}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="font-medium">{faq.question}</span>

                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="mt-16">
          <div className="rounded-2xl border bg-muted/40 p-8 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">Still need help?</h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Our support team can help you troubleshoot issues, understand
                  PMS features and configure your property.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted">
                  <Mail className="h-4 w-4" />
                  Contact support
                </button>

                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" />
                  Start a conversation
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer help links */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t pt-8 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-foreground">
            Documentation
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          <button className="flex items-center gap-1 hover:text-foreground">
            API Documentation
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          <button className="flex items-center gap-1 hover:text-foreground">
            System Status
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          <button className="flex items-center gap-1 hover:text-foreground">
            Privacy & Security
            <ShieldCheck className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}

function QuickGuide({
  icon: Icon,
  title,
  description,
  steps,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  steps: string[];
}) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {index + 1}
            </span>

            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-1 text-sm font-medium text-primary">
        Read guide
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
