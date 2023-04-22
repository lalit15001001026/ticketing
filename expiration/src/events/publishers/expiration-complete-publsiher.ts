import { Subjects, Publisher, ExpirationCompleteEvent } from "@ly15001001026/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {

    subject : Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}