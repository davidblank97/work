<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->
	<xsl:template match="/user_preferences">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<preference tag="mig_pulse_use_voltage_for_initial_pulse_width" value="false"/>
			<preference tag="mig_pulse_voltage_slope" value="19.6"/>
			<preference tag="mig_pulse_voltage_offset" value="-295.0"/>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>