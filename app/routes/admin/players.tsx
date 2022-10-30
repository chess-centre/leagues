import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import Button from "~/components/core/button";
import IconButton from "~/components/core/button/icon";
import { PLAYER_SCHEMA } from "~/db/schemas.server";
import Input from "~/components/core/input";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ErrorAlert from "~/components/core/alert/error";
import { AnimatePresence, motion } from "framer-motion";
import { createPlayer, deletePlayer, getPlayers } from "~/db/players.server";
import Select from "~/components/core/select";
import { getTeams } from "~/db/teams.server";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { z } from "zod";

type LoaderData = {
  players: Awaited<ReturnType<typeof getPlayers>>;
  teams: Awaited<ReturnType<typeof getTeams>>;
};

export const loader: LoaderFunction = async () => {
  const players = await getPlayers();
  const teams = await getTeams();

  return json({ players, teams });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "delete":
      const deleteInput = z
        .object({
          playerId: z.number(),
        })
        .safeParse({
          ...values,
          ...(values?.playerId ? { playerId: Number(values.playerId) } : {}),
        });

      if (!deleteInput.success) {
        const errors = deleteInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const {
        data: { playerId },
      } = deleteInput;
      await deletePlayer({ playerId });

      return json({ result: "deleted" });

    case "create":
      const createInput = PLAYER_SCHEMA.safeParse({
        ...values,
        ...(values?.teamId ? { teamId: Number(values.teamId) } : {}),
      });

      if (!createInput.success) {
        const errors = createInput.error.errors.reduce(
          (acc, { path, message }) => {
            return { ...acc, [path.join(".")]: message };
          },
          {}
        );
        return json({ errors, values });
      }

      const { data: player } = createInput;
      await createPlayer({
        player,
        select: { id: true },
      });

      return json({ result: "created" });
    default:
      throw new Error("Unrecognised request");
  }
};

export default function Players() {
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const transition = useTransition();
  const { players, teams } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const pendingAction =
    transition.state === "submitting" &&
    transition?.submission?.formData?.get("_action");
  const isSubmitting = !!pendingAction;
  const isSubmitted = actionData?.result;

  useEffect(() => {
    if (isSubmitted) {
      formRef?.current?.reset();
      firstNameRef?.current?.focus();
      if (actionData?.result === "created") {
        toast.success("Successfully added player");
      }
      if (actionData?.result === "deleted") {
        toast.success("Successfully deleted player");
      }
    }
  }, [actionData?.result, isSubmitted]);

  return (
    <div className="flex flex-wrap">
      <Form ref={formRef} method="post" className="w-full px-2 md:w-1/2">
        <fieldset disabled={isSubmitting}>
          <Input
            ref={firstNameRef}
            required
            label="First Name"
            name="firstName"
            defaultValue={actionData?.values?.firstName}
            error={actionData?.errors?.firstName}
          />

          <Input
            label="Middle Name"
            name="middleName"
            defaultValue={actionData?.values?.middleName}
            error={actionData?.errors?.middleName}
          />

          <Input
            required
            label="Last Name"
            name="lastName"
            defaultValue={actionData?.values?.lastName}
            error={actionData?.errors?.lastName}
          />

          <Select
            label="Team"
            name="teamId"
            options={teams.map((team) => ({
              label: team.name,
              value: team.id,
            }))}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={pendingAction === "create"}
              name="_action"
              value="create"
            >
              {pendingAction === "create" ? "Adding..." : "Add"}
            </Button>
          </div>
        </fieldset>
      </Form>

      <motion.div className="grow p-2 flex flex-col gap-2" layout>
        {players?.length ? (
          players.map((player) => (
            <AnimatePresence key={player.id} mode="popLayout">
              <motion.div
                className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-2"
                whileHover={{ scale: 1.01 }}
              >
                <Form method="post" className="w-full">
                  <fieldset
                    className="flex items-center justify-between"
                    disabled={isSubmitting}
                  >
                    <span>{`${player.firstName} ${player.lastName}`}</span>
                    <Input type="hidden" name="playerId" value={player.id} />
                    <IconButton
                      type="submit"
                      disabled={isSubmitting}
                      name="_action"
                      value="delete"
                      icon={<XMarkIcon className="h-6 w-6" />}
                      label={`Delete ${player.firstName} ${player.lastName}`}
                    />
                  </fieldset>
                </Form>
              </motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p>No players yet...</p>
        )}
      </motion.div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorAlert
      title="Error occurred in player form"
      detail={error.message}
    ></ErrorAlert>
  );
};
