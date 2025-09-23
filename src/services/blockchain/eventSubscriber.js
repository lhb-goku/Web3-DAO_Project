import logger from "../../utils/logger.js";
import { emitError } from "./errorHandler.js";

export function subscribeEvents(contract, io) {
  /** Donations */
  contract.on("DonationReceived", (donor, amount, event) => {
    emitGrouped(
      io,
      "donationReceived",
      {
        donor,
        amount: amount.toString(),
      },
      event
    );
  });

  /** Requests */
  contract.on("RequestCreated", (id, beneficiary, amount, event) => {
    emitGrouped(
      io,
      "requestUpdate",
      {
        type: "RequestCreated",
        id: id.toString(),
        beneficiary,
        amount: amount.toString(),
      },
      event
    );
  });

  contract.on("VoteCast", (requestId, voter, decision, event) => {
    emitGrouped(
      io,
      "requestUpdate",
      {
        type: "VoteCast",
        requestId: requestId.toString(),
        voter,
        decision,
      },
      event
    );
  });

  contract.on("PayoutSuccess", (requestId, beneficiary, amount, event) => {
    emitGrouped(
      io,
      "requestUpdate",
      {
        type: "PayoutSuccess",
        requestId: requestId.toString(),
        beneficiary,
        amount: amount.toString(),
      },
      event
    );
  });

  contract.on("RequestRejected", (requestId, event) => {
    emitGrouped(
      io,
      "requestUpdate",
      {
        type: "RequestRejected",
        requestId: requestId.toString(),
      },
      event
    );
  });

  /** Projects */
  contract.on("ProjectCreated", (projectId, owner, title, event) => {
    emitGrouped(
      io,
      "projectUpdate",
      {
        type: "ProjectCreated",
        projectId: projectId.toString(),
        owner,
        title,
      },
      event
    );
  });

  contract.on("ProjectVoteCast", (projectId, voter, decision, event) => {
    emitGrouped(
      io,
      "projectUpdate",
      {
        type: "ProjectVoteCast",
        projectId: projectId.toString(),
        voter,
        decision,
      },
      event
    );
  });

  contract.on("ProjectApproved", (projectId, event) => {
    emitGrouped(
      io,
      "projectUpdate",
      {
        type: "ProjectApproved",
        projectId: projectId.toString(),
      },
      event
    );
  });

  contract.on("ProjectRejected", (projectId, event) => {
    emitGrouped(
      io,
      "projectUpdate",
      {
        type: "ProjectRejected",
        projectId: projectId.toString(),
      },
      event
    );
  });

  contract.on("ProjectDonation", (projectId, donor, amount, event) => {
    emitGrouped(
      io,
      "projectUpdate",
      {
        type: "ProjectDonation",
        projectId: projectId.toString(),
        donor,
        amount: amount.toString(),
      },
      event
    );
  });

  contract.on("ProjectClosed", (projectId, totalFunded, event) => {
    emitGrouped(
      io,
      "projectUpdate",
      {
        type: "ProjectClosed",
        projectId: projectId.toString(),
        totalFunded: totalFunded.toString(),
      },
      event
    );
  });

  /** DAO */
  contract.on("DaoMemberAdded", (newMember, addedBy, event) => {
    emitGrouped(
      io,
      "daoUpdate",
      {
        type: "DaoMemberAdded",
        newMember,
        addedBy,
      },
      event
    );
  });
}

/* helper emit */
function emitGrouped(io, groupEvent, data, rawEvent) {
  try {
    logger.info(`${groupEvent}: ${JSON.stringify(data)}`);
    io.emit(groupEvent, {
      ...data,
      blockNumber: rawEvent.blockNumber,
      txHash: rawEvent.transactionHash,
    });
  } catch (err) {
    emitError(io, groupEvent, err);
  }
}
