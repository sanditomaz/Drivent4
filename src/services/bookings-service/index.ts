import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, forbiddenError } from "@/errors";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await bookingRepository.findRoomByRoomId(roomId);

  if (!room) throw notFoundError();

  if (room.Booking.length >= room.capacity) throw forbiddenError();

  return bookingRepository.insertBooking(userId, roomId);
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await bookingRepository.findRoomByRoomId(roomId);

  if (!room) throw notFoundError();

  if (room.Booking.length >= room.capacity) throw forbiddenError();

  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking || booking.id !== bookingId) {
    throw notFoundError();
  }

  return bookingRepository.updateBooking(bookingId, roomId);
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
