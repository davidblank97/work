<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<!-- FILE TYPE: SCH -->
	<xsl:template match="/language[@localeID='en-CA' and @fileType='SCH']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="43">
				<text>The %1 head is not currently active. Choose an active weld head or mark the %1 head as active from the administrative settings.</text>
				<desc>%1 = head model</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/language[@localeID='en-CA' and @fileType='SYS']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
				<str id="35">
					<text>There were some file conflicts that were not resolved since the IDs assigned already exist on the system. Assign vacant IDs to the remaining conflicts and try again. The following file conflicts were not resolved: |%1</text>
					<desc>%1 = A list of file conflicts that failed to resolve.</desc>
				</str>
		</xsl:copy>
	</xsl:template>
	
	<!-- Any new messages should be added to all language files independent of locale.
	Once translated a different xsl will update independent locale files-->
	<xsl:template match="/language[@fileType='AXI']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="28">
				<text>The direction of motion was towards the standing limit. Try to move away from this limit.</text>
				<desc>Detail to be added to another message.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>