import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import Loader from "../components/Loader";
import CampaignList from "../components/CampaignList";
import { campaignsData } from "./campainsData";

describe("App Component", () => {
  it('renders "Create WhatsApp Campaign" text', () => {
    render(<App />);
    const createCampaignText = screen.getByText(/Create WhatsApp Campaign/i);
    expect(createCampaignText).toBeInTheDocument();
  });

  it('renders "Existing Campaigns" text', () => {
    render(<App />);
    const existingCampaignsText = screen.getByText(/Existing Campaigns/i);
    expect(existingCampaignsText).toBeInTheDocument();
  });

  it("renders loading image when loading is true", () => {
    const loading = true;

    render(<Loader loading={loading} />);

    const loadingImage = screen.getByAltText(/loader/i);
    expect(loadingImage).toBeInTheDocument();
  });

  it("does not render loading image when loading is false", () => {
    const loading = false;

    render(<Loader loading={loading} />);

    const loadingImage = screen.queryByAltText(/loader/i);
    expect(loadingImage).not.toBeInTheDocument();
  });

  it('displays "No campaigns found." when campaigns array is empty', () => {
    render(<CampaignList campaigns={[]} />);

    const noCampaignsText = screen.queryByText(/No campaigns found/i);
    expect(noCampaignsText).toBeInTheDocument();
  });

  it("displays the list of campaigns when campaigns are available", () => {
    render(<CampaignList campaigns={campaignsData} />);

    expect(screen.getByText(/Welcome Message/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing notif/i)).toBeInTheDocument();
  });
});

