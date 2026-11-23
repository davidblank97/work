<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="/system_user_units/groups/theta_distance_telemetry">
		<xsl:copy-of select="."/>
		<wire_manipulator_speed unit=""/>
		<wire_manipulator_distance unit=""/>
		<rotating_tungsten_speed unit=""/>
		<rotating_tungsten_distance unit=""/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>