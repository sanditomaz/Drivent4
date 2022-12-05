import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/bookings-service";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);

    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = req.body.roomId;

  if (!roomId || roomId <= 0 ||  isNaN(roomId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const bookingId = await bookingService.postBooking(userId, roomId);

    res.status(httpStatus.OK).send(bookingId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);
  const bookingId = Number(req.params.bookingId);

  if (!roomId || roomId <= 0 || isNaN(roomId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if (!bookingId || bookingId <= 0 || isNaN(bookingId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const updatedBooking = await bookingService.updateBooking(userId, roomId, bookingId);

    res.status(httpStatus.OK).send(updatedBooking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
