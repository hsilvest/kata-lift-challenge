class Lift {
    constructor(queues, capacity) {
        this.queues = queues;
        this.capacity = capacity;
        this.people = [];
        this.currentFloor = 0;
        this.direction = "UP";
        this.log = [];
        this.finished = false;
    }

    start() {

        while (this.isTherePeopleWaiting() || !this.finished) {
            this.checkFloor();
            this.move();
        }

        return this.log;

    }

    up() {
        this.currentFloor++;
    }

    down() {
        this.currentFloor--;
    }

    load(people, target) {
        people.forEach((x) => target.splice(target.length, 0, x));
    }

    unload(people, target) {
        people.forEach((x) => target.splice(target.indexOf(x), 1));
    }

    logFloor() {
        this.log.push(this.currentFloor);
    }

    move() {

        this.direction = this.getDirection();

        switch (this.direction) {
            case "UP":
                this.up();
                break;
            case "DOWN":
                this.down();
                break;
            default:
                this.finish();
                break;
        }
    }

    isTherePeopleWaiting() {
        return (this.queues.map((x) => x.length).reduce((a, b) => a + b) + + this.people.length) > 0;
    }

    goingToTheSameDirection(person) {
        this.direction = this.getDirection();
        return ((this.direction == "UP" && person > this.currentFloor) || (this.direction == "DOWN" && person < this.currentFloor))
    }

    checkFloor() {

        if (this.currentFloor == 0 && this.queues.every((x) => x.length == 0)) {
            this.finish();
        }

        var peopleThatWantToEnterHere = this.queues[this.currentFloor] || [];
        var peopleThatWantToLeaveHere = this.people.filter((person) => person == this.currentFloor) || [];

        if (peopleThatWantToLeaveHere.length > 0) {
            this.unload(peopleThatWantToLeaveHere, this.people);
        }

        var availableSlots = this.capacity - this.people.length;

        var peopleThatWantToEnterAndAreGoingInTheSameDirection = peopleThatWantToEnterHere.filter((x) => this.goingToTheSameDirection.call(this, x));

        var peopleThatCanEnter = peopleThatWantToEnterAndAreGoingInTheSameDirection.slice(0, availableSlots);

        if (peopleThatCanEnter.length > 0) {
            if (availableSlots > 0) {
                this.load(peopleThatCanEnter, this.people);
                this.unload(peopleThatCanEnter, this.queues[this.currentFloor]);
            }
        }

        if (peopleThatCanEnter.length > 0 || peopleThatWantToLeaveHere.length > 0 || this.currentFloor == 0 || peopleThatWantToEnterAndAreGoingInTheSameDirection.length > 0) this.logFloor();
    }

    finish() {

        this.finished = true;
        return;
    }

    getDirection() {

        switch (this.direction) {
            case "UP":
                return this.queues[this.currentFloor].some((x) => x > this.currentFloor) ||
                    this.queues.slice(this.currentFloor + 1).some((x) => x.length > 0) ||
                    this.people.some((x) => x > this.currentFloor) ? "UP" : "DOWN"
            case "DOWN":
                return this.queues[this.currentFloor].some((x) => x < this.currentFloor) ||
                    this.queues.slice(0, this.currentFloor).some((x) => x.length > 0) ||
                    this.people.some((x) => x < this.currentFloor) ||
                    this.queues.every((x) => x.length == 0) ? "DOWN" : "UP"
            default:
                return "N/A"
        }
    }
}

var theLift = function (queues, capacity) {

    var q = [
        [8, 8, 6], [8, 3, 4, 7], [], [2, 6, 8, 5], [], [0, 8, 8, 4, 1], [], [3, 2, 2, 3], []
    ]
        ;

    c = 9;

    //[0,]

    var lift = new Lift(q, c);

    return lift.start();



}();
