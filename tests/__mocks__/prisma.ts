type Row = Record<string, any>;

const db = {
  order: new Map<string, Row>(),
  payment: new Map<string, Row>()
};

let autoId = 0;
const newId = () => `id_${++autoId}`;

export const prismaMock = {
  $transaction: async (fn: any) => fn(prismaMock),

  order: {
    findUnique: async ({ where: { id } }: any) => db.order.get(id) || null,
    count: async () => db.order.size,
    update: async ({ where: { id }, data }: any) => {
      const cur = db.order.get(id);
      if (!cur) throw new Error("order not found");
      const next = { ...cur, ...data };
      db.order.set(id, next);
      return next;
    },
    updateMany: async ({ where, data }: any) => {
      let changed = 0;
      for (const [k, v] of db.order.entries()) {
        const match = !where || (where.invoiceId ? v.invoiceId === where.invoiceId : true);
        if (match) {
          db.order.set(k, { ...v, ...data });
          changed++;
        }
      }
      return { count: changed };
    },
    create: async ({ data }: any) => {
      const row = { id: data.id ?? newId(), ...data };
      db.order.set(row.id, row);
      return row;
    }
  },

  payment: {
    findUnique: async ({ where: { providerPaymentId, id } }: any) => {
      if (id) return db.payment.get(id) || null;
      if (providerPaymentId) {
        for (const v of db.payment.values()) if (v.providerPaymentId === providerPaymentId) return v;
      }
      return null;
    },
    findFirst: async ({ where }: any) => {
      for (const v of db.payment.values()) {
        const okOrder = !where.orderId || v.orderId === where.orderId;
        const okStatus = !where.status?.in || where.status.in.includes(v.status);
        if (okOrder && okStatus) return v;
      }
      return null;
    },
    create: async ({ data }: any) => {
      const row = { id: data.id ?? newId(), ...data };
      db.payment.set(row.id, row);
      return row;
    },
    update: async ({ where: { id, providerPaymentId }, data }: any) => {
      let row: any;
      if (id) row = db.payment.get(id);
      if (!row && providerPaymentId) {
        for (const v of db.payment.values()) if (v.providerPaymentId === providerPaymentId) row = v;
      }
      if (!row) throw new Error("payment not found");
      const next = { ...row, ...data };
      db.payment.set(next.id, next);
      return next;
    }
  }
};

export function seedOrder(partial: Partial<Row> = {}) {
  const row = {
    id: partial.id ?? `order_${Date.now()}_${Math.random()}`,
    status: partial.status ?? "pending",
    totalCents: partial.totalCents ?? 1234,
    invoiceId: partial.invoiceId ?? undefined,
    invoiceState: partial.invoiceState ?? undefined,
    ...partial
  };
  db.order.set(row.id, row);
  return row;
}

export function seedPayment(partial: Partial<Row> = {}) {
  if (!partial.orderId) throw new Error("seedPayment requires orderId");
  const row = {
    id: partial.id ?? `pay_${Date.now()}_${Math.random()}`,
    orderId: partial.orderId,
    provider: "square",
    providerPaymentId: partial.providerPaymentId ?? "PAY_XXX",
    status: partial.status ?? "approved",
    amountCents: partial.amountCents ?? 1234,
    currency: partial.currency ?? "CAD",
    ...partial
  };
  db.payment.set(row.id, row);
  return row;
}

export function resetDb() {
  db.order.clear();
  db.payment.clear();
  autoId = 0;
}
