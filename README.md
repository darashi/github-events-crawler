# A crawler for github events

## Usage
    DB_PATH="[/data/github/github].YYYYMMDD.HH.[jsons]" npm start

`DB_PATH` specifies the filename format of destination files. `DB_PATH` is treat
ed as [Moment.js](http://momentjs.com/) format string (in UTC).
