import { SeatItem, TicketTierType } from '../types';

export function generateSeatingLayout(eventId: string): SeatItem[] {
  const seats: SeatItem[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const seatsPerRow = 12;

  // Let's create deterministic seats for an arena/stadium
  rows.forEach((row, rowIndex) => {
    let tier: TicketTierType = 'Regular';
    let zone = 'Grandstand West';
    let priceRwf = 10000;

    if (rowIndex <= 1) {
      tier = 'VIP';
      zone = 'VIP Ringside / Courtside Zone';
      priceRwf = 50000;
    } else if (rowIndex <= 3) {
      tier = 'Premium';
      zone = 'Lower Bowl Center Zone';
      priceRwf = 25000;
    } else if (rowIndex <= 5) {
      tier = 'Regular';
      zone = 'Grandstand Upper Tier';
      priceRwf = 10000;
    } else {
      tier = 'Standard';
      zone = 'Standard Concourse Terrace';
      priceRwf = 5000;
    }

    for (let num = 1; num <= seatsPerRow; num++) {
      // Deterministic taken seats based on eventId + row + num
      const pseudoHash = (eventId.length * 37 + rowIndex * 13 + num * 7) % 10;
      const isTaken = pseudoHash === 1 || pseudoHash === 4;

      seats.push({
        id: `${row}${num}`,
        tier,
        zone,
        row,
        number: num,
        status: isTaken ? 'taken' : 'available',
        priceRwf,
      });
    }
  });

  return seats;
}
