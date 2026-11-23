<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/cal/amps" >
		<amps timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</amps>
	</xsl:template>
	<xsl:template match="/cal/volts" >
		<volts timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</volts>
	</xsl:template>
	<xsl:template match="/cal/hotwire" >
		<hotwire timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</hotwire>
	</xsl:template>
	<xsl:template match="/cal/hotwire2" >
		<hotwire2 timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</hotwire2>
	</xsl:template>
	<xsl:template match="/cal/pilot" >
		<pilot timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</pilot>
	</xsl:template>
	<xsl:template match="/cal/shield_gas" >
		<shield_gas timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</shield_gas>
	</xsl:template>
	<xsl:template match="/cal/trail_gas" >
		<trail_gas timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</trail_gas>
	</xsl:template>
	<xsl:template match="/cal/plasma_gas" >
		<plasma_gas timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</plasma_gas>
	</xsl:template>
	<xsl:template match="/cal/backup_gas" >
		<backup_gas timestamp="">
			<xsl:apply-templates select="@*|node()"/>
		</backup_gas>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>