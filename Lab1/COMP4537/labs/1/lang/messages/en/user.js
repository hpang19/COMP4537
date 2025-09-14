const LANDING_PAGE_TEXT = {
    title: "Lab 1 - JSON, Object Constructor, localStorage",
    buttons: {
        writer: "Writer",
        reader: "Reader"
    }
  };

const WRITER_PAGE_TEXT = {
    title: "Writer",
    buttons: {
        add: "Add",
        remove: "Remove",
        back: "Back"
    },
    timestamp_msg: "stored at: "
  };

const READER_PAGE_TEXT = {
    title: "Reader",
    buttons: {
        back: "Back"
    },
    timestamp_msg: "updated at: "
  };

export const PAGE_TEXT = {
    "/index.html": LANDING_PAGE_TEXT,
    "/writer.html": WRITER_PAGE_TEXT,
    "/reader.html": READER_PAGE_TEXT
  }