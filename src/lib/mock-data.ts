import type { Batch, Item, Notification, User } from "./types";

/**
 * Realistic dummy data for the prototype. All identifiers are stable
 * so deep-linking from one screen to another works deterministically.
 */

export const currentUser: User = {
  id: "u_001",
  name: "Brain Watanabe",
  email: "brain@droposit.app",
  role: "depositor",
};

export const staffUser: User = {
  id: "s_001",
  name: "Maya Chen",
  email: "maya@droposit.staff",
  role: "staff",
};

const watchImg =
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80";
const glassesImg =
  "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80";
const bagImg =
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";
const walletImg =
  "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80";
const keysImg =
  "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80";
const headphonesImg =
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80";

export const itemsByBatch: Record<string, Item[]> = {
  b_001: [
    {
      id: "i_101",
      batchId: "b_001",
      title: "Gold watch given by grandpa",
      description:
        "Given by grandpa in 1967. Made of 22k gold. Green dial with original leather strap.",
      imageUrl: watchImg,
      status: "pending",
      createdAt: "2026-05-13T08:24:00Z",
    },
    {
      id: "i_102",
      batchId: "b_001",
      title: "Glasses",
      description:
        "Black stainless steel frame. Glasses made from sand from the Sahara.",
      imageUrl: glassesImg,
      status: "pending",
      createdAt: "2026-05-13T08:27:00Z",
    },
  ],
  b_002: [
    {
      id: "i_201",
      batchId: "b_002",
      title: "Leather wallet",
      description: "Tan calfskin, monogrammed initials BW inside.",
      imageUrl: walletImg,
      status: "deposited",
      createdAt: "2026-05-12T10:00:00Z",
    },
    {
      id: "i_202",
      batchId: "b_002",
      title: "Car keys",
      description: "Silver Audi key fob with red lanyard.",
      imageUrl: keysImg,
      status: "deposited",
      createdAt: "2026-05-12T10:01:00Z",
    },
  ],
  b_003: [
    {
      id: "i_301",
      batchId: "b_003",
      title: "Studio headphones",
      description: "Over-ear, matte black. Carrying case included.",
      imageUrl: headphonesImg,
      status: "claimed",
      createdAt: "2026-05-10T15:42:00Z",
    },
  ],
};

export const batches: Batch[] = [
  {
    id: "b_001",
    qr_token: "drp-ae7f3b2c",
    ownerId: "u_001",
    ownerName: "Brain Watanabe",
    title: "Exam day essentials",
    description: "Includes gold watch and glasses in a black leather bag",
    status: "pending",
    createdAt: "2026-05-13T08:20:00Z",
    items: itemsByBatch.b_001,
  },
  {
    id: "b_002",
    qr_token: "drp-c9d4e5f1",
    ownerId: "u_001",
    ownerName: "Brain Watanabe",
    title: "Pocket valuables",
    description: "Wallet, keys, and small accessories",
    status: "deposited",
    createdAt: "2026-05-12T09:55:00Z",
    items: itemsByBatch.b_002,
  },
  {
    id: "b_003",
    qr_token: "drp-f2a1b8e9",
    ownerId: "u_001",
    ownerName: "Brain Watanabe",
    title: "Music gear",
    description: "Studio headphones for the session",
    status: "claimed",
    createdAt: "2026-05-10T15:40:00Z",
    items: itemsByBatch.b_003,
  },
];

/** Staff view — all active batches in the system across many users. */
export const systemBatches: Batch[] = [
  {
    id: "b_500",
    qr_token: "drp-7d3c9a1e",
    ownerId: "u_500",
    ownerName: "Alex Jones",
    title: "Alex's batch",
    description: "Includes gloves, shoes, and scarf",
    status: "deposited",
    createdAt: "2026-05-13T07:10:00Z",
    items: [
      {
        id: "i_501",
        batchId: "b_500",
        title: "Leather gloves",
        description: "Brown lambskin.",
        imageUrl: bagImg,
        status: "deposited",
        createdAt: "2026-05-13T07:10:00Z",
      },
      {
        id: "i_502",
        batchId: "b_500",
        title: "Wool scarf",
        description: "Charcoal grey, cashmere blend.",
        imageUrl: bagImg,
        status: "deposited",
        createdAt: "2026-05-13T07:11:00Z",
      },
    ],
  },
  {
    id: "b_501",
    qr_token: "drp-b4f0e2d8",
    ownerId: "u_501",
    ownerName: "Elisa Jackson",
    title: "New batch 2",
    description: "Includes watches and necklaces",
    status: "deposited",
    createdAt: "2026-05-13T07:30:00Z",
    items: [
      {
        id: "i_601",
        batchId: "b_501",
        title: "Silver pendant",
        description: "Sterling silver, family heirloom.",
        imageUrl: walletImg,
        status: "deposited",
        createdAt: "2026-05-13T07:31:00Z",
      },
    ],
  },
  {
    id: "b_502",
    qr_token: "drp-c1e5a3f7",
    ownerId: "u_502",
    ownerName: "Jamie Cole",
    title: "Tech kit",
    description: "Wireless earbuds and charger",
    status: "deposited",
    createdAt: "2026-05-13T07:42:00Z",
    items: [],
  },
  {
    id: "b_503",
    qr_token: "drp-9b2d4e6a",
    ownerId: "u_503",
    ownerName: "Priya Shah",
    title: "Backpack",
    description: "Includes notebook, calculator, snacks",
    status: "deposited",
    createdAt: "2026-05-13T07:55:00Z",
    items: [],
  },
];

export const retrievedBatches: Batch[] = [
  {
    id: "b_700",
    qr_token: "drp-3f8c1d5b",
    ownerId: "u_700",
    ownerName: "Marcus Lin",
    title: "Marcus's batch",
    description: "Sports gear and water bottle",
    status: "claimed",
    createdAt: "2026-05-12T16:30:00Z",
    items: [],
  },
  {
    id: "b_701",
    qr_token: "drp-e6a9d2c4",
    ownerId: "u_701",
    ownerName: "Sara Ahmed",
    title: "Day pack",
    description: "Documents and stationery",
    status: "claimed",
    createdAt: "2026-05-12T17:05:00Z",
    items: [],
  },
];

export const notifications: Notification[] = [
  {
    id: "n_001",
    title: "Batch deposited",
    message: "Your batch 'Pocket valuables' was deposited at Checkpoint A.",
    timestamp: "2026-05-12T10:02:00Z",
    read: false,
    type: "deposit",
  },
  {
    id: "n_002",
    title: "Item claimed",
    message: "Your studio headphones have been claimed. Have a great session.",
    timestamp: "2026-05-10T16:00:00Z",
    read: true,
    type: "retrieval",
  },
  {
    id: "n_003",
    title: "Welcome to Droposit",
    message: "Create your first batch to begin depositing items.",
    timestamp: "2026-05-08T09:00:00Z",
    read: true,
    type: "system",
  },
];

/** Resolve any batch across all mock collections by its qr_token. */
export function findBatchByToken(token: string) {
  return (
    [...batches, ...systemBatches, ...retrievedBatches].find(
      (b) => b.qr_token === token
    ) ?? null
  );
}
