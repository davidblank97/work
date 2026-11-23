<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="/UnitData/groups/theta_distance_telemetry">
		<xsl:copy-of select="."/>
		<wire_manipulator_speed name="WIRE MANIPULATOR SPEED"/>
		<wire_manipulator_distance name="WIRE MANIPULATOR DISTANCE"/>
		<rotating_tungsten_speed name="TUNGSTEN SPEED"/>
		<rotating_tungsten_distance name="TUNGSTEN DISTANCE"/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>