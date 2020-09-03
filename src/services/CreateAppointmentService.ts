import { startOfHour } from 'date-fns';

import Appointment from '../models/appointment/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

interface RequestAppointment {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    private appointmentsRepository: AppointmentRepository;

    constructor(appointmentRepository: AppointmentRepository) {
        this.appointmentsRepository = appointmentRepository;
    }

    public execute({ provider, date }: RequestAppointment): Appointment {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = this.appointmentsRepository.findByDate(appointmentDate);

        if(findAppointmentInSameDate) {
            throw Error('This appointment is already booked');
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate
        });

        return appointment;
    }
}

export default CreateAppointmentService;
