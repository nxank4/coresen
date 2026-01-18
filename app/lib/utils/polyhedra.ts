import * as THREE from "three";

export interface Vertex {
  x: number;
  y: number;
  z: number;
}

/**
 * Normalize vertex to unit sphere
 */
function normalize(vertex: Vertex, radius: number = 1): Vertex {
  const length = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: (vertex.x / length) * radius,
    y: (vertex.y / length) * radius,
    z: (vertex.z / length) * radius,
  };
}

/**
 * Generate low poly sphere vertices (minimal vertices)
 */
export function generateSphereVertices(radius: number = 1, segments: number = 4): Vertex[] {
  const geom = new THREE.SphereGeometry(radius, segments, segments);
  const positions = geom.attributes.position.array as Float32Array;
  const vertices: Vertex[] = [];
  
  for (let i = 0; i < positions.length; i += 3) {
    vertices.push({
      x: positions[i],
      y: positions[i + 1],
      z: positions[i + 2],
    });
  }
  
  return vertices;
}

/**
 * Generate octahedron vertices (6 vertices, 8 faces)
 */
export function generateOctahedronVertices(radius: number = 1): Vertex[] {
  const vertices: Vertex[] = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];
  
  return vertices.map(v => normalize(v, radius));
}

/**
 * Generate tetrahedron vertices (4 vertices)
 */
export function generateTetrahedronVertices(radius: number = 1): Vertex[] {
  // Regular tetrahedron vertices
  const t = 1.0 / Math.sqrt(2);
  const vertices: Vertex[] = [
    { x: 1, y: 1, z: 1 },
    { x: -1, y: -1, z: 1 },
    { x: -1, y: 1, z: -1 },
    { x: 1, y: -1, z: -1 },
  ];
  
  return vertices.map(v => normalize(v, radius));
}

/**
 * Generate cube vertices (8 vertices)
 */
export function generateCubeVertices(radius: number = 1): Vertex[] {
  const vertices: Vertex[] = [
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 },
  ];
  
  return vertices.map(v => normalize(v, radius));
}

/**
 * Generate icosahedron vertices (12 vertices)
 */
export function generateIcosahedronVertices(radius: number = 1): Vertex[] {
  const t = (1.0 + Math.sqrt(5.0)) / 2.0; // Golden ratio
  const vertices: Vertex[] = [
    { x: -1, y: t, z: 0 },
    { x: 1, y: t, z: 0 },
    { x: -1, y: -t, z: 0 },
    { x: 1, y: -t, z: 0 },
    { x: 0, y: -1, z: t },
    { x: 0, y: 1, z: t },
    { x: 0, y: -1, z: -t },
    { x: 0, y: 1, z: -t },
    { x: t, y: 0, z: -1 },
    { x: t, y: 0, z: 1 },
    { x: -t, y: 0, z: -1 },
    { x: -t, y: 0, z: 1 },
  ];
  
  return vertices.map(v => normalize(v, radius));
}

/**
 * Generate dodecahedron vertices (20 vertices)
 */
export function generateDodecahedronVertices(radius: number = 1): Vertex[] {
  const phi = (1.0 + Math.sqrt(5.0)) / 2.0; // Golden ratio
  const vertices: Vertex[] = [
    { x: -1, y: -1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: 1, z: 1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: -1 },
    { x: 1, y: 1, z: 1 },
    { x: 0, y: -1 / phi, z: -phi },
    { x: 0, y: -1 / phi, z: phi },
    { x: 0, y: 1 / phi, z: -phi },
    { x: 0, y: 1 / phi, z: phi },
    { x: -1 / phi, y: -phi, z: 0 },
    { x: -1 / phi, y: phi, z: 0 },
    { x: 1 / phi, y: -phi, z: 0 },
    { x: 1 / phi, y: phi, z: 0 },
    { x: -phi, y: 0, z: -1 / phi },
    { x: -phi, y: 0, z: 1 / phi },
    { x: phi, y: 0, z: -1 / phi },
    { x: phi, y: 0, z: 1 / phi },
  ];
  
  return vertices.map(v => normalize(v, radius));
}

/**
 * Find nearest vertex in target shape based on spherical coordinates
 */
export function findNearestVertex(
  sourceVertex: Vertex,
  targetVertices: Vertex[]
): Vertex {
  let nearest = targetVertices[0];
  let maxDot = -Infinity;
  
  const sourceLength = Math.sqrt(
    sourceVertex.x * sourceVertex.x +
    sourceVertex.y * sourceVertex.y +
    sourceVertex.z * sourceVertex.z
  );
  
  if (sourceLength === 0) return nearest;
  
  const normalizedSource = {
    x: sourceVertex.x / sourceLength,
    y: sourceVertex.y / sourceLength,
    z: sourceVertex.z / sourceLength,
  };
  
  for (const target of targetVertices) {
    const targetLength = Math.sqrt(
      target.x * target.x + target.y * target.y + target.z * target.z
    );
    if (targetLength === 0) continue;
    
    const normalizedTarget = {
      x: target.x / targetLength,
      y: target.y / targetLength,
      z: target.z / targetLength,
    };
    
    // Dot product to find closest direction
    const dot =
      normalizedSource.x * normalizedTarget.x +
      normalizedSource.y * normalizedTarget.y +
      normalizedSource.z * normalizedTarget.z;
    
    if (dot > maxDot) {
      maxDot = dot;
      nearest = target;
    }
  }
  
  return nearest;
}

/**
 * Smoothstep easing function for seamless transitions
 */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Cubic ease-in-out for smooth morphing
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation between two vertices
 */
export function lerpVertex(
  a: Vertex,
  b: Vertex,
  t: number
): Vertex {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}
