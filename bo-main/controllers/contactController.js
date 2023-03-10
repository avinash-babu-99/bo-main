const contactModel = require("../models/contactModel");
const roomModel =  require("../models/roomModel")
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const AppError = require("../utils/appError");
const model = require("../models/contactUserModel");

const filterObject = (obj, ...otherFields) => {
  let finalObject = {};
  Object.keys(obj).forEach((el) => {
    if (otherFields.includes(el)) {
      finalObject[el] = obj[el];
    }
  });

  return finalObject;
};

const getFileBase64 = (path, fileName) => {

  const base64 = fs.readFileSync(
    `${path}/${fileName}`
  );

  const base64String = base64.toString('base64');

  return base64String
}


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image, please upload only image files", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserProfile = upload.single("photo");

exports.saveProfilePhotoDetails = catchAsync(async (req, res, next) => {
  console.log(req.file, 'file');
  let profilePicture = {
    fileName: req?.file?.filename && req.file.filename,
    path: req?.file?.destination && req.file.destination,
    originalFileName: req?.file?.originalname && req.file.originalname,
    isProfileUploaded: true,
    mimetype: req?.file?.mimetype && req.file.mimetype,
  }

  let updatedContact

  if (req.user && req.user._id) {

    updatedContact = await contactModel.findByIdAndUpdate(req.user._id, {
      profilePicture
    }, { new: true });
  }

  res.status(201).json({
    status: 'success!!',
    message: 'photo successfully uploaded.',
    updatedContact
  })

})

exports.getProfilePhoto = catchAsync(async (req, res, next) => {
  const fileName = req.params.fileName;

  const base64 = fs.readFileSync(
    "assets/images/user-6400831aa611cb3d1ce40bc5.jpeg"
  );

  const base64String = base64.toString('base64');

  res.status(201).json({
    blob: base64String,
  });
});

exports.getContacts = catchAsync(async (req, res, next) => {
  const users = await contactModel.find().populate("contacts.contact");

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: users.length,
    data: users,
  });
});

exports.getContactByPhone = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await contactModel
    .find({ phone: req.body.phone })
    .populate("contacts.contact")
    .populate("sentFriendRequests")
    .populate("receivedFriendRequests");

  // await user.populate("users").execPopulate();
  console.log(user, "user");

  if (!user.length) {
    return next(new AppError("incorrect number", 400));
  }

  res.status(201).json({
    message: "success!!",
    user: user,
  });
});

exports.getAddFriends = catchAsync(async (req, res, next) => {
  let searchArray = req.body.searchArray;
  let currentUser = req.body.currentUser;
  let finalArray = [];
  finalArray.push(currentUser._id);

  if (currentUser.contacts) {
    currentUser.contacts.forEach((data) => {
      if (data.contact && data.contact._id) {
        finalArray.push(data.contact._id);
      }
    });
  }
  const users = await contactModel
    .find({ _id: { $nin: finalArray } })
    .populate("contacts.contact");

  res.status(201).json({
    status: "success",
    users,
  });
});

exports.addFriendRequest = catchAsync(async (req, res, next) => {
  const fromPayload = req.body.from;
  const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
    sentFriendRequests: [...fromPayload.sentFriendRequests],
  });

  const toPayload = req.body.to;
  console.log(toPayload._id);
  const toResponse = await contactModel.findByIdAndUpdate(toPayload._id, {
    receivedFriendRequests: [...toPayload.receivedFriendRequests],
  });

  console.log(toResponse, "toResponse");

  res.status(201).json({
    status: "Success",
    message: "Request Sent!!",
  });
});

exports.acceptOrRejectFriendRequest = catchAsync(async (req, res, next) => {
  console.log(req.body, "body");
  const fromPayload = req.body.from;
  const toPayload = req.body.to;

  const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
    $pull: { receivedFriendRequests: toPayload._id },
  });

  const toResponse = await contactModel.findByIdAndUpdate(toPayload._id, {
    $pull: { sentFriendRequests: fromPayload._id },
  });

  if (req.body.action === "accept") {
    const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
      $push: {
        contacts: {
          contact: toPayload._id,
        },
      },
    },
    {
      new: true
    }
    );

    const toResponse = await contactModel.findByIdAndUpdate(toPayload._id, {
      $push: {
        contacts: {
          contact: fromPayload._id,
        },
      },
    },
    {
      new: true
    }
    );

    const payload = {
      users: [fromResponse, toResponse],
    };

    const contactId = toResponse._id
    const userId = fromResponse._id

    let user = await contactModel.findById(userId).populate("contacts.contact")

    let userIndex = user.contacts.findIndex((contact) => {
      return contact.contact._id.equals(contactId)
    })

    let contact = await contactModel.findById(contactId).populate("contacts.contact")

    let contactIndex = contact.contacts.findIndex((contact) => {
      return contact.contact._id.equals(userId)
    })

    const postedData = await roomModel.create(payload);

    contact.contacts[contactIndex]['roomId'] = postedData._id;

    user.contacts[userIndex]['roomId'] = postedData._id;

    await contact.save()

    await user.save()


  }

  res.status(201).json({
    status: "success!",
    message: "status updated",
  });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
  const removeResponse = await contactModel.findByIdAndUpdate(req.body._id, {
    $pull: {
      contacts: {
        contact: { _id: req.body.contactId },
      },
    },
  });

  const Response = await contactModel.findByIdAndUpdate(req.body.contactId, {
    $pull: { contacts: { contact: { _id: req.body._id } } },
  });

  res.status(201).json({
    status: "success!",
    message: "status updated",
  });
});

exports.getContactById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let user;
  if (id) {
    user = await contactModel
      .findById(id)
      .populate("contacts.contact")
      .populate("sentFriendRequests")
      .populate("receivedFriendRequests");
  }

  let base64

  if (user.profilePicture && user.profilePicture.isProfileUploaded) {

    base64 = getFileBase64(user.profilePicture.path, user.profilePicture.fileName)

  }

  if (user) {
    res.status(201).json({
      status: "success",
      response: user,
      files: {
        profile: base64 && base64
      }
    });
  }
});

exports.findByIdAndUpdate = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let user;
  if (id) {
    user = await contactModel
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .populate("contacts.contact")
      .populate("sentFriendRequests")
      .populate("receivedFriendRequests");
  }

  if (user) {
    res.status(201).json({
      status: "updated successfully",
      response: user,
    });
  }
});

exports.generateProfilesBase64 = catchAsync(async (req, res, next) => {
  let contacts = req.body
  let finalArray = []

  contacts.forEach(contact => {
    if (contact && contact.profilePicture && contact.profilePicture.isProfileUploaded) {

      let base64 = getFileBase64(contact.profilePicture.path, contact.profilePicture.fileName)

      finalArray.push({
        contact,
        base64
      })
    }
  })

  res.status(201).json({
    status: 'success',
    res: finalArray
  })

})

exports.aggregateTest = catchAsync(async (req, res, next) => {
  let response;

  response = await contactModel.aggregate([
    {
      $match: {
        status: { $in: ["online", "offline"] },
      },
    },
    {
      $group: {
        _id: {
          statusGroup: "$status",
          phone: "$phone",
        },
        highest_population: { $first: "$phone" },
      },
    },

    {
      $project: {
        _id: 0,
        data: {
          statusProject: "$_id.statusGroup",
          phonePoject: "$_id.phone",
        },
      },
    },
  ]);

  res.status(201).json({
    data: response,
  });
});
