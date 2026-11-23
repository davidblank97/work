<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="UnitData/groups/theta_distance">
		<theta_distance_setpoint name="THETA DISTANCE SETPOINT"/>
	</xsl:template>
	
	<xsl:template match="UnitData/groups/gas_flow">
		<xsl:copy-of select="."/>
		<theta_distance_telemetry name="THETA DISTANCE TELEMETRY"/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>