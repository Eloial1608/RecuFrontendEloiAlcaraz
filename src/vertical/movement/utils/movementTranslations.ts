export type Language = "ca" | "es" | "en";

const en = {
  movements: "Movements",
  subtitle: "Latest account activity",
  latest: "Showing the latest 100 movements.",
  loading: "Loading movements...",
  empty: "No movements yet.",
  emptyHint: "Deposits, transfers and card payments will appear here.",
  refresh: "Refresh",
  unavailable: "Unable to load movements.",
  sessionExpired: "Your session has expired. Please sign in again.",
  genericError: "Something went wrong. Please try again.",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  payment: "Payment",
  bizum: "Bizum",
  refund: "Refund",
  creditCardPayment: "Credit card payment",
  creditCardDebtPayment: "Credit card debt payment",
  debitCardPayment: "Debit card payment",
  other: "Movement",
};

export type MovementText = typeof en;

export const movementTranslations: Record<Language, MovementText> = {
  en,
  ca: {
    movements: "Moviments",
    subtitle: "Activitat recent del compte",
    latest: "Es mostren els 100 moviments més recents.",
    loading: "Carregant moviments...",
    empty: "Encara no hi ha moviments.",
    emptyHint: "Els ingressos, transferències i pagaments amb targeta apareixeran aquí.",
    refresh: "Actualitzar",
    unavailable: "No s'han pogut carregar els moviments.",
    sessionExpired: "La teva sessió ha caducat. Torna a iniciar sessió.",
    genericError: "Alguna cosa ha fallat. Torna-ho a provar.",
    deposit: "Ingrés",
    withdrawal: "Retirada",
    transfer: "Transferència",
    payment: "Pagament",
    bizum: "Bizum",
    refund: "Reemborsament",
    creditCardPayment: "Pagament amb targeta de crèdit",
    creditCardDebtPayment: "Pagament de deute de targeta de crèdit",
    debitCardPayment: "Pagament amb targeta de dèbit",
    other: "Moviment",
  },
  es: {
    movements: "Movimientos",
    subtitle: "Actividad reciente de la cuenta",
    latest: "Se muestran los 100 movimientos más recientes.",
    loading: "Cargando movimientos...",
    empty: "Todavía no hay movimientos.",
    emptyHint: "Los ingresos, transferencias y pagos con tarjeta aparecerán aquí.",
    refresh: "Actualizar",
    unavailable: "No se han podido cargar los movimientos.",
    sessionExpired: "Tu sesión ha caducado. Vuelve a iniciar sesión.",
    genericError: "Algo ha fallado. Inténtalo de nuevo.",
    deposit: "Ingreso",
    withdrawal: "Retirada",
    transfer: "Transferencia",
    payment: "Pago",
    bizum: "Bizum",
    refund: "Reembolso",
    creditCardPayment: "Pago con tarjeta de crédito",
    creditCardDebtPayment: "Pago de deuda de tarjeta de crédito",
    debitCardPayment: "Pago con tarjeta de débito",
    other: "Movimiento",
  },
};

export function getMovementText(language: Language): MovementText {
  return movementTranslations[language];
}
