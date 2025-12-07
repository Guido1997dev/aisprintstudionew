import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject, updateProject, deleteProject, getProjectWithStats } from '@/lib/data-library';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Missing companyId parameter' },
        { status: 400 }
      );
    }

    const projects = await getProjects(companyId);
    
    // Load stats for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const stats = await getProjectWithStats(project.id);
        return {
          ...project,
          documentCount: stats.documentCount,
          readyDocuments: stats.readyDocuments,
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: projectsWithStats,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, name, description } = body;

    if (!companyId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, name' },
        { status: 400 }
      );
    }

    const project = await createProject(companyId, name, description);

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to create project. Please check if Supabase is configured and the database tables exist.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to create project. Please check Supabase configuration.';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, name, description } = body;

    if (!projectId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, name' },
        { status: 400 }
      );
    }

    const project = await updateProject(projectId, { name, description });

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId parameter' },
        { status: 400 }
      );
    }

    const success = await deleteProject(projectId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete project' },
      { status: 500 }
    );
  }
}

