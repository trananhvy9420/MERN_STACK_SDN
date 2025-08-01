const Player = require("../models/player");
const Comment = require("../models/comment");
const Team = require("../models/team");
const Member = require("../models/member");
const findAllPlayer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { playerName, teamId, isCaptain, status } = req.query;

    const queryCondition = {};

    if (status === "disabled") {
      queryCondition.disable = true;
    } else if (status === "all") {
    } else {
      queryCondition.disable = { $ne: true };
    }

    if (playerName) {
      queryCondition.playerName = { $regex: playerName, $options: "i" };
    }
    if (teamId) {
      queryCondition.team = teamId;
    }
    if (isCaptain === "true") {
      queryCondition.isCaptain = true;
    }

    const [players, totalRecords] = await Promise.all([
      Player.find(queryCondition)
        .populate("team")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Player.countDocuments(queryCondition),
    ]);

    if (!players || players.length === 0) {
      return res.status(200).json({
        message: "No players found matching the criteria.",
        data: [],
        pagination: {
          limit: limit,
          currentPage: page,
          totalPages: 0,
          totalRecords: 0,
        },
      });
    }

    const totalPages = Math.ceil(totalRecords / limit);
    const response = {
      message: "Successfully fetched players.",
      data: players,
      pagination: {
        limit: limit,
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
      },
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching players:", error);
    return res
      .status(500)
      .json({ message: "Error fetching players from database." });
  }
};

const foundPlayer = async (req, res) => {
  try {
    const playerNameQuery = req.query.playerName;
    if (!playerNameQuery) {
      return res
        .status(400)
        .json({ message: "Player name query is required." });
    }
    const regex = new RegExp(playerNameQuery, "i");
    const queryCondition = {
      disable: { $ne: true },
      playerName: { $regex: regex },
    };
    const [players] = await Promise.all([
      Player.find(queryCondition).populate("team"),
    ]);
    const response = {
      message: "Successfully fetched players",
      data: players,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching players:", error);
    return res
      .status(500)
      .json({ message: "Error fetching players from the database." });
  }
};
const getPlayerById = async (req, res) => {
  try {
    const id = req.query.id;
    const player = await Player.findById(id).populate("team");
    if (!player) {
      return res
        .status(404)
        .json({ message: "Player not found with that ID." });
    }
    return res.status(200).json({ message: "Player found", data: player });
  } catch (error) {
    console.log("Error fetching player by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error or invalid ID format." });
  }
};
const createPlayer = async (req, res) => {
  const { playerName, image, cost, isCaptain, information, team } = req.body;
  try {
    const existingPlayer = await Player.findOne({
      playerName: playerName,
      disable: { $ne: true },
    });
    if (existingPlayer) {
      return res.status(400).json({
        message: "Player with this name already exists.",
      });
    } // Kiểm tra xem cầu thủ có bị vô hiệu hóa không
    const newPlayer = new Player({
      playerName: playerName,
      image: image,
      cost: cost,
      isCaptain: isCaptain,
      information: information,
      team: team,
    });
    const savedPlayer = await newPlayer.save();
    const response = {
      message: "Create player successfully",
      data: savedPlayer,
    };
    res.status(201).json(response);
  } catch (error) {
    console.log("Error creating player by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error or invalid ID format." });
  }
};
const updatePlayer = async (req, res) => {
  const id = req.params.playerId;
  const updateData = {};
  const allowedFields = [
    "playerName",
    "image",
    "cost",
    "isCaptain",
    "information",
    "team",
  ];

  // Vòng lặp để chỉ lấy các trường được phép cập nhật
  for (const field of allowedFields) {
    // Chỉ thêm vào updateData nếu trường đó tồn tại trong req.body
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update." });
  }

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      updateData, // <--- SỬA Ở ĐÂY: Truyền thẳng object updateData
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found." });
    }

    const response = {
      message: "Updated player successfully",
      data: updatedPlayer,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error updating player by ID:", error);
    // Xử lý lỗi cụ thể hơn
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    return res
      .status(500)
      .json({ message: "An internal server error occurred." });
  }
};

const addComment = async (req, res) => {
  const id = req.params.playerId;
  const authorId = req.member.id;
  const member = await Member.findById(authorId);
  if (member.isAdmin === true) {
    return res.status(404).json({ message: "Admin không được comment" });
  }
  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    if (player.disable) {
      return res
        .status(404)
        .json({ message: "Player is disable so can not comment" });
    }
    const existingComment = player.comments.find(
      (comment) => comment.author.toString() === authorId.toString()
    );
    if (existingComment) {
      return res
        .status(409)
        .json({ message: "You have already commented on this player." });
    }
    const newComment = {
      rating: req.body.rating,
      content: req.body.content,
      author: authorId,
    };

    const a = new Comment({
      rating: req.body.rating,
      content: req.body.content,
      author: authorId,
    });
    const savedComment = await a.save();

    player.comments.push(newComment);
    const savedPlayer = await player.save();
    const addedComment = savedPlayer.comments[savedPlayer.comments.length - 1];
    return res.status(201).json({
      message: "Comment added successfully!",
      data: addedComment,
      comment: a,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    console.error("Message:", error.message);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." });
  }
};
const fetchCommentWithPlayerID = async (req, res) => {
  const id = req.params.playerId;

  try {
    const player = await Player.findById(id).populate({
      path: "comments.author",
      select: "name",
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const commentsWithAuthorDetails = player.comments;

    return res.status(200).json({
      message: "Find comments successfully",
      data: commentsWithAuthorDetails,

      requestingMember: req.member,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    console.error("Message:", error.message);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." });
  }
};

const deletePlayer = async (req, res) => {
  const id = req.params.playerId;
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { disable: true },
      { new: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    // if (updatedPlayer.disable === true) {
    //   return res.status(404).json({ message: "Đã disable" });
    // }
    return res.status(200).json({
      message: "Player disabled successfully",
      data: updatedPlayer,
    });
  } catch (error) {
    console.error("Error disabling player: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred while disabling the team." });
  }
};
const activePlayer = async (req, res) => {
  const id = req.params.playerId;
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { disable: false },
      { new: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    // if (updatedPlayer.disable === false) {
    //   return res.status(404).json({ message: "Đã active" });
    // }
    return res.status(200).json({
      message: "Player active successfully",
      data: updatedPlayer,
    });
  } catch (error) {
    console.error("Error disabling player: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred while disabling the team." });
  }
};
const editComment = async (req, res) => {
  try {
    const { playerId, commentId } = req.params;
    const { rating, content } = req.body;
    const memberId = req.member.id;

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Không tìm thấy cầu thủ." });
    }

    if (player.disable) {
      return res.status(403).json({
        message:
          "Cầu thủ này đã bị vô hiệu hóa, không thể thực hiện hành động.",
      });
    }
    const commentToEdit = player.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!commentToEdit) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bình luận này trong danh sách." });
    }
    if (commentToEdit.disable) {
      return res.status(403).json({
        message: "Bình luận này đã bị khóa và không thể chỉnh sửa nữa.",
      });
    }

    const updateFields = {};
    if (rating) {
      updateFields["comments.$.rating"] = rating;
    }
    if (content) {
      updateFields["comments.$.content"] = content;
    }

    updateFields["comments.$.disable"] = true;

    const updatedPlayer = await Player.findOneAndUpdate(
      {
        _id: playerId,
        "comments._id": commentId,
        "comments.author": memberId,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPlayer) {
      return res.status(404).json({
        message:
          "Không có quyền chỉnh sửa bình luận này (có thể không phải bạn là tác giả).",
      });
    }

    return res.status(200).json({
      message:
        "Chỉnh sửa bình luận thành công! Bình luận này hiện đã được khóa.",
      data: updatedPlayer,
    });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa bình luận:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ.", details: error.message });
    }
    return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ." });
  }
};
const deleteComment = async (req, res) => {
  const { playerId, commentId } = req.params;
  const memberId = req.member.id;
  try {
    // Xóa sub-document trong Player
    const player = await Player.findOneAndUpdate(
      { _id: playerId, "comments.author": memberId },
      { $pull: { comments: { _id: commentId } } }
    );

    // Xóa trong collection Comment
    await Comment.findByIdAndDelete(commentId);

    if (!player) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bình luận hoặc bạn không có quyền." });
    }

    return res.status(200).json({ message: "Xóa bình luận thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

const findAllPlayerIsCaptain = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryCondition = { isCaptain: true, disable: { $ne: true } };

    const [players, totalRecords] = await Promise.all([
      Player.find(queryCondition).populate("team").skip(skip).limit(limit),

      Player.countDocuments(queryCondition),
    ]);

    if (!players || players.length === 0) {
      return res.status(200).json({
        message: "No players found who are captains.",
        pagination: {
          limit: limit,
          currentPage: page,
          totalPages: 0,
          totalRecords: 0,
        },
      });
    }

    const totalPages = Math.ceil(totalRecords / limit);

    const response = {
      message: "Successfully fetched players who are captains.",
      data: players,
      pagination: {
        limit: limit,
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching players who are captains:", error);
    return res
      .status(500)
      .json({ message: "Error fetching players from database." });
  }
};
const findAllPlayerInTeam = async (req, res) => {
  try {
    const teamID = req.params.teamId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryCondition = {
      team: teamID,
      disable: { $ne: true },
    };

    const [players, totalRecords] = await Promise.all([
      Player.find(queryCondition).populate("team").skip(skip).limit(limit),

      Player.countDocuments(queryCondition),
    ]);

    if (!players || players.length === 0) {
      return res.status(200).json({
        message: "No players found in this team.",
        pagination: {
          limit: limit,
          currentPage: page,
          totalPages: 0,
          totalRecords: 0,
        },
      });
    }

    const totalPages = Math.ceil(totalRecords / limit);

    const response = {
      message: "Successfully fetched players in the team.",
      data: players,
      pagination: {
        limit: limit,
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching players in team:", error);
    return res
      .status(500)
      .json({ message: "Error fetching players from database." });
  }
};
const getPlayerStats = async (req, res) => {
  try {
    const [totalPlayers, disabledPlayers, activePlayers] = await Promise.all([
      Player.countDocuments(),
      Player.countDocuments({ disable: true }),
      Player.countDocuments({ disable: { $ne: true } }),
    ]);

    // Trả về kết quả
    res.status(200).json({
      message: "Player statistics fetched successfully.",
      data: {
        totalPlayers,
        disabledPlayers,
        activePlayers,
      },
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching player statistics." });
  }
};
const rating = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Không tìm thấy cầu thủ." });
    }
    if (player.comments.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }
    const totalRating = player.comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    const averageRating = Math.ceil(totalRating / player.comments.length);
    res.status(200).json({
      playerId: player._id,
      averageRating: averageRating.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
  }
};
module.exports = {
  findAllPlayer,
  foundPlayer,
  getPlayerById,
  updatePlayer,
  createPlayer,
  addComment,
  fetchCommentWithPlayerID,
  deletePlayer,
  editComment,
  deleteComment,
  findAllPlayerIsCaptain,
  findAllPlayerInTeam,
  getPlayerStats,
  activePlayer,
  rating,
};
